"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataClient = void 0;
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
const server_list_mgr_1 = require("./server_list_mgr");
const client_worker_1 = require("./client_worker");
const snapshot_1 = require("./snapshot");
const const_1 = require("./const");
const utils_1 = require("./utils");
const http_agent_1 = require("./http_agent");
const configuration_1 = require("./configuration");
const assert = require("assert");
const Base = require('sdk-base');
class DataClient extends Base {
    constructor(options) {
        if (!options.endpoint && !options.serverAddr) {
            assert(options.endpoint, '[Client] options.endpoint or options.serverAddr is required');
        }
        options = Object.assign({}, const_1.DEFAULT_OPTIONS, options);
        super(options);
        this.configuration = this.options.configuration = new configuration_1.Configuration(options);
        this.snapshot = this.getSnapshot();
        this.serverMgr = this.getServerListManager();
        const CustomHttpAgent = this.configuration.get(interface_1.ClientOptionKeys.HTTP_AGENT);
        this.httpAgent = CustomHttpAgent ? new CustomHttpAgent({ configuration: this.configuration }) : new http_agent_1.HttpAgent({ configuration: this.configuration });
        this.configuration.merge({
            snapshot: this.snapshot,
            serverMgr: this.serverMgr,
            httpAgent: this.httpAgent,
        });
        this.clients = new Map();
        this.snapshot.on('error', err => this.throwError(err));
        this.serverMgr.on('error', err => this.throwError(err));
        this.ready(true);
    }
    get appName() {
        return this.configuration.get(interface_1.ClientOptionKeys.APPNAME);
    }
    get httpclient() {
        return this.configuration.get(interface_1.ClientOptionKeys.HTTPCLIENT);
    }
    /**
     * 获取当前机器所在机房
     * @return {String} currentUnit
     */
    async getCurrentUnit() {
        return await this.serverMgr.getCurrentUnit();
    }
    /**
     * 获取所有单元信息
     * @return {Array} units
     */
    async getAllUnits() {
        return await this.serverMgr.fetchUnitLists();
    }
    /**
     * 订阅
     * @param {Object} info
     *   - {String} dataId - id of the data you want to subscribe
     *   - {String} [group] - group name of the data
     *   - {String} [unit] - which unit you want to connect, default is current unit
     * @param {Function} listener - listener
     * @return {DataClient} self
     */
    subscribe(info, listener) {
        const { dataId, group } = info;
        (0, utils_1.checkParameters)(dataId, group);
        const client = this.getClient(info);
        client.subscribe({ dataId, group }, listener);
        return this;
    }
    /**
     * 退订
     * @param {Object} info
     *   - {String} dataId - id of the data you want to subscribe
     *   - {String} [group] - group name of the data
     *   - {String} [unit] - which unit you want to connect, default is current unit
     * @param {Function} listener - listener
     * @return {DataClient} self
     */
    unSubscribe(info, listener) {
        const { dataId, group } = info;
        (0, utils_1.checkParameters)(dataId, group);
        const client = this.getClient(info);
        client.unSubscribe({ dataId, group }, listener);
        return this;
    }
    /**
     * 获取配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {String} value
     */
    async getConfig(dataId, group, options) {
        (0, utils_1.checkParameters)(dataId, group);
        const client = this.getClient(options);
        return await client.getConfig(dataId, group);
    }
    /**
     * 查询租户下的所有的配置
     * @return {Array} config
     */
    async getConfigs() {
        const client = this.getClient();
        return await client.getConfigs();
    }
    /**
     * 发布配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {String} content - config value
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {Boolean} success
     */
    async publishSingle(dataId, group, content, options) {
        (0, utils_1.checkParameters)(dataId, group);
        const client = this.getClient(options);
        return await client.publishSingle(dataId, group, content, options && options.type);
    }
    /**
     * 删除配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {Boolean} success
     */
    async remove(dataId, group, options) {
        (0, utils_1.checkParameters)(dataId, group);
        const client = this.getClient(options);
        return await client.remove(dataId, group);
    }
    /**
     * 批量获取配置
     * @param {Array} dataIds - data id array
     * @param {String} group - group name of the data
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {Array} result
     */
    async batchGetConfig(dataIds, group, options) {
        (0, utils_1.checkParameters)(dataIds, group);
        const client = this.getClient(options);
        return await client.batchGetConfig(dataIds, group);
    }
    /**
     * 批量查询
     * @param {Array} dataIds - data id array
     * @param {String} group - group name of the data
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {Object} result
     */
    async batchQuery(dataIds, group, options) {
        (0, utils_1.checkParameters)(dataIds, group);
        const client = this.getClient(options);
        return await client.batchQuery(dataIds, group);
    }
    /**
     * 将配置发布到所有单元
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {String} content - config value
     * @return {Boolean} success
     */
    async publishToAllUnit(dataId, group, content) {
        (0, utils_1.checkParameters)(dataId, group);
        const units = await this.getAllUnits();
        await units.map(unit => this.getClient({ unit }).publishSingle(dataId, group, content));
        return true;
    }
    /**
     * 将配置从所有单元中删除
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @return {Boolean} success
     */
    async removeToAllUnit(dataId, group) {
        (0, utils_1.checkParameters)(dataId, group);
        const units = await this.getAllUnits();
        await units.map(unit => this.getClient({ unit }).remove(dataId, group));
        return true;
    }
    async publishAggr(dataId, group, datumId, content, options) {
        (0, utils_1.checkParameters)(dataId, group, datumId);
        const client = this.getClient(options);
        return await client.publishAggr(dataId, group, datumId, content);
    }
    async removeAggr(dataId, group, datumId, options) {
        (0, utils_1.checkParameters)(dataId, group, datumId);
        const client = this.getClient(options);
        return await client.removeAggr(dataId, group, datumId);
    }
    close() {
        this.serverMgr.close();
        for (const client of this.clients.values()) {
            client.close();
        }
        this.clients.clear();
    }
    getClient(options = {}) {
        if (!options.unit) {
            options.unit = const_1.CURRENT_UNIT;
        }
        const { unit } = options;
        let client = this.clients.get(unit);
        if (!client) {
            client = this.getClientWorker(Object.assign({}, {
                configuration: this.configuration.attach({ unit })
            }));
            client.on('error', err => {
                this.throwError(err);
            });
            this.clients.set(unit, client);
        }
        return client;
    }
    /**
     * 默认异常处理
     * @param {Error} err - 异常
     * @return {void}
     * @private
     */
    throwError(err) {
        if (err) {
            setImmediate(() => this.emit('error', err));
        }
    }
    /**
     * 供其他包覆盖
     * @param options
     */
    getClientWorker(options) {
        return new client_worker_1.ClientWorker(options);
    }
    getServerListManager() {
        return new server_list_mgr_1.ServerListManager(this.options);
    }
    getSnapshot() {
        return new snapshot_1.Snapshot(this.options);
    }
}
exports.DataClient = DataClient;
//# sourceMappingURL=client.js.map