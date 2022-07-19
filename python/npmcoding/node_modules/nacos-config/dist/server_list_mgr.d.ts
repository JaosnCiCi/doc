import { IConfiguration, IServerListManager, ISnapshot } from './interface';
declare const Base: any;
interface ServerCacheData {
    hosts: [string];
    index: number;
}
export declare class ServerListManager extends Base implements IServerListManager {
    private isSync;
    private isClosed;
    private serverListCache;
    private currentUnit;
    private isDirectMode;
    protected loggerDomain: string;
    private debugPrefix;
    protected debug: any;
    private currentServerAddrMap;
    /**
     * 服务地址列表管理器
     *
     * @param {Object} options
     *   - {HttpClient} httpclient - http 客户端
     *   - {Snapshot} [snapshot] - 快照对象
     *   - {String} nameServerAddr - 命名服务器地址 `hostname:port`
     * @constructor
     */
    constructor(options: any);
    formatOptions(): void;
    get configuration(): IConfiguration;
    get snapshot(): ISnapshot;
    get httpclient(): any;
    get nameServerAddr(): string;
    get refreshInterval(): number;
    get contextPath(): string;
    get clusterName(): string;
    get endpointQueryParams(): any;
    get requestTimeout(): number;
    /**
     * 关闭地址列表服务
     */
    close(): void;
    private request;
    getCurrentUnit(): Promise<string>;
    /**
     * 同步服务器列表
     * @return {void}
     */
    syncServers(): void;
    fetchServerList(unit?: string): Promise<{
        hosts: any;
        index: any;
    }>;
    formatKey(unit: any): string;
    protected getRequestUrl(unit: any): string;
    /**
     * 获取单元列表
     * @return {Array} units
     */
    fetchUnitLists(): Promise<string[]>;
    updateCurrentServer(unit?: string): Promise<void>;
    /**
     * 获取某个单元的地址
     * @param {String} unit 单元名，默认为当前单元
     * @return {String} address
     */
    getCurrentServerAddr(unit?: string): Promise<any>;
    hasServerInCache(serverName: any): boolean;
    getServerInCache(unit?: string): ServerCacheData;
    clearServerCache(): void;
}
export {};
