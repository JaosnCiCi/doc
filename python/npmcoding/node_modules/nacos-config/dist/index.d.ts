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
import { DataClient } from './client';
import { BaseClient, ClientOptions } from './interface';
export * from './interface';
export { DataClient } from './client';
export { ClientWorker } from './client_worker';
export { ServerListManager } from './server_list_mgr';
export { Snapshot } from './snapshot';
export { HttpAgent } from './http_agent';
declare const APIClientBase: any;
export declare class NacosConfigClient extends APIClientBase implements BaseClient {
    protected _client: BaseClient;
    /**
     * cluster-client wrapper client
     * set after constructor
     */
    constructor(options?: ClientOptions);
    get DataClient(): typeof DataClient;
    get clusterOptions(): {
        name: string;
    };
    /**
     * 订阅
     * @param {Object} reg
     *   - {String} dataId - id of the data you want to subscribe
     *   - {String} [group] - group name of the data
     *   - {String} [unit] - which unit you want to connect, default is current unit
     * @param {Function} listener - listener
     * @return {DiamondClient} self
     */
    subscribe(reg: any, listener: any): this;
    /**
     * 退订
     * @param {Object} reg
     *   - {String} dataId - id of the data you want to subscribe
     *   - {String} [group] - group name of the data
     *   - {String} [unit] - which unit you want to connect, default is current unit
     * @param {Function} listener - listener
     * @return {DiamondClient} self
     */
    unSubscribe(reg: any, listener: any): this;
    /**
     * 获取当前机器所在机房
     * @return {String} currentUnit
     */
    getCurrentUnit(): Promise<string>;
    /**
     * 获取所有单元信息
     * @return {Array} units
     */
    getAllUnits(): Promise<string[]>;
    /**
     * 查询租户下的所有的配置
     * @return {Array} config
     */
    getConfigs(): Promise<string[]>;
    /**
     * 获取配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {String} value
     */
    getConfig(dataId: any, group: any, options?: any): Promise<string>;
    /**
     * 发布配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {String} content - config value
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {Boolean} success
     */
    publishSingle(dataId: any, group: any, content: any, options?: any): Promise<boolean>;
    /**
     * 删除配置
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {Boolean} success
     */
    remove(dataId: any, group: any, options?: any): Promise<boolean>;
    /**
     * 批量获取配置
     * @param {Array} dataIds - data id array
     * @param {String} group - group name of the data
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {Array} result
     */
    batchGetConfig(dataIds: any, group: any, options?: any): Promise<object>;
    /**
     * 批量查询
     * @param {Array} dataIds - data id array
     * @param {String} group - group name of the data
     * @param {Object} options
     *   - {Stirng} unit - which unit you want to connect, default is current unit
     * @return {Object} result
     */
    batchQuery(dataIds: any, group: any, options?: any): Promise<object>;
    /**
     * 将配置发布到所有单元
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @param {String} content - config value
     * @return {Boolean} success
     */
    publishToAllUnit(dataId: any, group: any, content?: any): Promise<boolean>;
    /**
     * 将配置从所有单元中删除
     * @param {String} dataId - id of the data
     * @param {String} group - group name of the data
     * @return {Boolean} success
     */
    removeToAllUnit(dataId: any, group: any): Promise<boolean>;
    publishAggr(dataId: any, group: any, datumId: any, content: any, options: any): Promise<boolean>;
    removeAggr(dataId: any, group: any, datumId: any, options: any): Promise<boolean>;
    close(): void;
    static get DataClient(): typeof DataClient;
}
