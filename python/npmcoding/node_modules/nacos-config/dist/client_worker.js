"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWorker = void 0;
/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const interface_1 = require("./interface");
const const_1 = require("./const");
const utils_1 = require("./utils");
const path = require("path");
const is = require("is-type-of");
const Base = require('sdk-base');
const gather = require('co-gather');
const { sleep } = require('mz-modules');
class ClientWorker extends Base {
    constructor(options) {
        super(options);
        this.uuid = (Math.random() * 1000).toFixed(0);
        this.isClose = false;
        this.isLongPulling = false;
        this.subscriptions = new Map();
        this.loggerDomain = 'Nacos';
        this.debugPrefix = this.loggerDomain.toLowerCase();
        this.debug = require('debug')(`${this.debugPrefix}:${process.pid}:ins-${this.uuid}:client_worker`);
        this.apiRoutePath = {
            GET: `/v1/cs/configs`,
            BATCH_GET: `/v1/cs/configs`,
            BATCH_QUERY: `/v1/cs/configs`,
            PUBLISH: `/v1/cs/configs`,
            PUBLISH_ALL: `/v1/cs/configs`,
            REMOVE: `/v1/cs/configs`,
            REMOVE_ALL: `/v1/cs/configs`,
            LISTENER: '/v1/cs/configs/listener'
        };
        this.listenerDataKey = 'Listening-Configs';
        // 同一个key可能会被多次订阅，避免不必要的 `warning`
        this.setMaxListeners(100);
        this.ready(true);
        this.debug('client worker start');
    }
    get configuration() {
        return this.options.configuration;
    }
    get appName() {
        return this.configuration.get(interface_1.ClientOptionKeys.APPNAME);
    }
    get snapshot() {
        return this.configuration.get(interface_1.ClientOptionKeys.SNAPSHOT);
    }
    get unit() {
        return this.configuration.get(interface_1.ClientOptionKeys.UNIT);
    }
    get httpAgent() {
        return this.configuration.get(interface_1.ClientOptionKeys.HTTP_AGENT);
    }
    get namespace() {
        return this.configuration.get(interface_1.ClientOptionKeys.NAMESPACE);
    }
    get defaultEncoding() {
        return this.configuration.get(interface_1.ClientOptionKeys.DEFAULT_ENCODING) || 'utf8';
    }
    close() {
        this.isClose = true;
        this.removeAllListeners();
    }
    /**
     * 订阅
     * @param {Object} info
     *   - {String} dataId - id of the data you want to subscribe
     *   - {String} [group] - group name of the data
     * @param {Function} listener - listener
     */
    subscribe(info, listener) {
        this.debug('calling subscribe, dataId: %s, group: %s', info.dataId, info.group);
        const { dataId, group } = info;
        const key = this.formatKey(info);
        this.on(key, listener);
        let item = this.subscriptions.get(key);
        if (!item) {
            item = {
                dataId,
                group,
                md5: null,
                content: null,
            };
            this.subscriptions.set(key, item);
            (async () => {
                try {
                    await this.syncConfigs([item]);
                    await this.startLongPulling();
                }
                catch (err) {
                    this._error(err);
                }
            })();
        }
        else if (!is.nullOrUndefined(item.md5)) {
            process.nextTick(() => listener(item.content));
        }
        return this;
    }
    /**
     * 同步配置
     * @param {Array} list - 需要同步的配置列表
     * @return {void}
     */
    async syncConfigs(list) {
        const tasks = list.map(({ dataId, group }) => this.getConfig(dataId, group));
        const results = await gather(tasks, 5);
        for (let i = 0, len = results.length; i < len; i++) {
            const key = this.formatKey(list[i]);
            const item = this.subscriptions.get(key);
            const result = results[i];
            if (!item) {
                this.debug('item %s not exist', key); // maybe removed by user
                continue;
            }
            if (result.isError) {
                const err = new Error(`[${this.loggerDomain}#ClientWorker] getConfig failed for dataId: ${item.dataId}, group: ${item.group}, error: ${result.error}`);
                err.name = `${this.loggerDomain}SyncConfigError`;
                err.dataId = item.dataId;
                err.group = item.group;
                this._error(err);
                continue;
            }
            const content = result.value;
            const md5 = (0, utils_1.getMD5String)(content, this.defaultEncoding);
            // 防止应用启动时，并发请求，导致同一个 key 重复触发
            if (item.md5 !== md5) {
                item.md5 = md5;
                item.content = content;
                // 异步化，避免处理逻辑异常影响到 nacos 内部
                // 这里将获取的数据直接事件的方式返回给 subscribe 一开始监听的地方
                this.debug('get new data and callback to listener', item);
                setImmediate(() => this.emit(key, content));
            }
        }
    }
    /**
     * 开启长轮询
     * @return {void}
     * @private
     */
    async startLongPulling() {
        // 防止重入
        if (this.isLongPulling) {
            return;
        }
        this.isLongPulling = true;
        (async () => {
            try {
                while (!this.isClose && this.subscriptions.size > 0) {
                    try {
                        await this.checkServerConfigInfo();
                    }
                    catch (err) {
                        err.name = `${this.loggerDomain}LongPullingError`;
                        this._error(err);
                        await sleep(2000);
                    }
                }
                this.isLongPulling = false;
            }
            catch (err) {
                this.isLongPulling = false;
                this._error(err);
            }
        })();
    }
    async checkServerConfigInfo() {
        this.debug('start to check update config list');
        if (this.subscriptions.size === 0) {
            return;
        }
        const beginTime = Date.now();
        const tenant = this.namespace;
        const probeUpdate = [];
        for (const { dataId, group, md5 } of this.subscriptions.values()) {
            this.debug('calling startLongPulling(checkServerConfigInfo), dataId: %s, group: %s', dataId, group);
            probeUpdate.push(dataId, const_1.WORD_SEPARATOR);
            probeUpdate.push(group, const_1.WORD_SEPARATOR);
            if (tenant) {
                probeUpdate.push(md5, const_1.WORD_SEPARATOR);
                probeUpdate.push(tenant, const_1.LINE_SEPARATOR);
            }
            else {
                probeUpdate.push(md5, const_1.LINE_SEPARATOR);
            }
        }
        const postData = {};
        // 开启权限验证后需要携带租户，否则没有权限
        if (tenant) {
            Object.assign(postData, { tenant });
        }
        postData[this.listenerDataKey] = probeUpdate.join('');
        const content = await this.httpAgent.request(this.apiRoutePath.LISTENER, {
            method: 'POST',
            data: postData,
            headers: {
                'Long-Pulling-Timeout': '30000',
            },
            timeout: 40000, // 超时时间比longPullingTimeout稍大一点，避免主动超时异常
        });
        this.debug('long pulling takes %ds', (Date.now() - beginTime) / 1000);
        const updateList = this.parseUpdateDataIdResponse(content);
        // 说明这个 id 列表有更新
        if (updateList && updateList.length) {
            this.debug('data has changed and will be sync', updateList);
            // 去同步这个 ip 列表的配置
            await this.syncConfigs(updateList);
        }
    }
    // 解析 nacos 返回的 long pulling 结果
    parseUpdateDataIdResponse(content) {
        const updateList = [];
        decodeURIComponent(content)
            .split(const_1.LINE_SEPARATOR)
            .forEach(dataIdAndGroup => {
            if (dataIdAndGroup) {
                const keyArr = dataIdAndGroup.split(const_1.WORD_SEPARATOR);
                if (keyArr.length >= 2) {
                    const dataId = keyArr[0];
                    const group = keyArr[1];
                    updateList.push({
                        dataId,
                        group,
                    });
                }
            }
        });
        return updateList;
    }
    /**
     * 退订
     * @param {Object} info
     *   - {String} dataId - id of the data you want to subscribe
     *   - {String} group - group name of the data
     * @param {Function} listener - listener
     */
    unSubscribe(info, listener) {
        const key = this.formatKey(info);
        if (listener) {
            this.removeListener(key, listener);
        }
        else {
            this.removeAllListeners(key);
        }
        // 没有人订阅了，从长轮询里拿掉
        if (this.listeners(key).length === 0) {
            this.subscriptions.delete(key);
        }
        return this;
    }
    /**
     * 默认异常处理
     * @param {Error} err - 异常
     * @return {void}
     * @private
     */
    _error(err) {
        if (err) {
            setImmediate(() => this.emit('error', err));
        }
    }
    formatKey(info) {
        return `${info.dataId}@${info.group}@${this.unit}`;
    }
    getSnapshotKey(dataId, group, tenant) {
        tenant = tenant || this.namespace || 'default_tenant';
        return path.join('config', this.unit, tenant, group, dataId);
    }
    /**
     * 获取配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @return {String} value
     */
    async getConfig(dataId, group) {
        this.debug('calling getConfig, dataId: %s, group: %s', dataId, group);
        let content;
        const key = this.getSnapshotKey(dataId, group);
        // TODO 优先使用本地配置
        try {
            content = await this.httpAgent.request(this.apiRoutePath.GET, {
                data: {
                    dataId,
                    group,
                    tenant: this.namespace,
                },
            });
        }
        catch (err) {
            const cache = await this.snapshot.get(key);
            if (cache) {
                this._error(err);
                return cache;
            }
            throw err;
        }
        await this.snapshot.save(key, content);
        return content;
    }
    /**
     * 查询租户下的所有的配置
     * @return {Array} config
     */
    async getConfigs() {
        return null;
    }
    /**
     * 发布配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {String} content - config value
     * @param {String} type - type of the data
     * @return {Boolean} success
     */
    async publishSingle(dataId, group, content, type) {
        await this.httpAgent.request(this.apiRoutePath.PUBLISH, {
            method: 'POST',
            encode: true,
            data: {
                dataId,
                group,
                content,
                tenant: this.namespace,
                type,
                appName: this.appName
            },
        });
        return true;
    }
    /**
     * 删除配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @return {Boolean} success
     */
    async remove(dataId, group) {
        await this.httpAgent.request(this.apiRoutePath.REMOVE, {
            method: 'DELETE',
            data: {
                dataId,
                group,
                tenant: this.namespace,
            },
            dataAsQueryString: true,
        });
        return true;
    }
    async publishAggr(dataId, group, datumId, content) {
        return true;
    }
    async removeAggr(dataId, group, datumId) {
        return null;
    }
    /**
     * 批量获取配置
     * @param {Array} dataIds - data id array
     * @param {String} group - group name of the data
     * @return {Array} result
     */
    async batchGetConfig(dataIds, group) {
        return null;
    }
    /**
     * 批量查询
     * @param {Array} dataIds - data id array
     * @param {String} group - group name of the data
     * @return {Object} result
     */
    async batchQuery(dataIds, group) {
        return null;
    }
    // for test
    clearSubscriptions() {
        this.subscriptions.clear();
    }
}
exports.ClientWorker = ClientWorker;
//# sourceMappingURL=client_worker.js.map