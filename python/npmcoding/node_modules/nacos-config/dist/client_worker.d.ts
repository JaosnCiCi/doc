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
import { API_ROUTE, IClientWorker, IConfiguration, ISnapshot } from './interface';
import { HttpAgent } from './http_agent';
declare const Base: any;
export declare class ClientWorker extends Base implements IClientWorker {
    private uuid;
    private isClose;
    private isLongPulling;
    private subscriptions;
    protected loggerDomain: string;
    private debugPrefix;
    private debug;
    protected apiRoutePath: API_ROUTE;
    protected listenerDataKey: string;
    constructor(options: any);
    get configuration(): IConfiguration;
    get appName(): string;
    get snapshot(): ISnapshot;
    get unit(): string;
    get httpAgent(): HttpAgent;
    get namespace(): string;
    get defaultEncoding(): string;
    close(): void;
    /**
     * 订阅
     * @param {Object} info
     *   - {String} dataId - id of the data you want to subscribe
     *   - {String} [group] - group name of the data
     * @param {Function} listener - listener
     */
    subscribe(info: any, listener: any): this;
    /**
     * 同步配置
     * @param {Array} list - 需要同步的配置列表
     * @return {void}
     */
    private syncConfigs;
    /**
     * 开启长轮询
     * @return {void}
     * @private
     */
    private startLongPulling;
    private checkServerConfigInfo;
    private parseUpdateDataIdResponse;
    /**
     * 退订
     * @param {Object} info
     *   - {String} dataId - id of the data you want to subscribe
     *   - {String} group - group name of the data
     * @param {Function} listener - listener
     */
    unSubscribe(info: any, listener?: any): this;
    /**
     * 默认异常处理
     * @param {Error} err - 异常
     * @return {void}
     * @private
     */
    _error(err: any): void;
    private formatKey;
    private getSnapshotKey;
    /**
     * 获取配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @return {String} value
     */
    getConfig(dataId: any, group: any): Promise<any>;
    /**
     * 查询租户下的所有的配置
     * @return {Array} config
     */
    getConfigs(): Promise<any>;
    /**
     * 发布配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {String} content - config value
     * @param {String} type - type of the data
     * @return {Boolean} success
     */
    publishSingle(dataId: any, group: any, content: any, type: any): Promise<boolean>;
    /**
     * 删除配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @return {Boolean} success
     */
    remove(dataId: any, group: any): Promise<boolean>;
    publishAggr(dataId: any, group: any, datumId: any, content: any): Promise<boolean>;
    removeAggr(dataId: any, group: any, datumId: any): Promise<any>;
    /**
     * 批量获取配置
     * @param {Array} dataIds - data id array
     * @param {String} group - group name of the data
     * @return {Array} result
     */
    batchGetConfig(dataIds: any, group: any): Promise<any>;
    /**
     * 批量查询
     * @param {Array} dataIds - data id array
     * @param {String} group - group name of the data
     * @return {Object} result
     */
    batchQuery(dataIds: any, group: any): Promise<any>;
    clearSubscriptions(): void;
}
export {};
