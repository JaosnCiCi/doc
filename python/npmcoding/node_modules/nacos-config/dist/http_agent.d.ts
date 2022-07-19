import { IConfiguration, IServerListManager } from './interface';
export declare class HttpAgent {
    options: any;
    protected loggerDomain: string;
    private debugPrefix;
    private debug;
    constructor(options: any);
    get configuration(): IConfiguration;
    get serverListMgr(): IServerListManager;
    /**
     * HTTP 请求客户端
     */
    get httpclient(): any;
    get unit(): any;
    get secretKey(): any;
    get requestTimeout(): any;
    get accessKey(): any;
    get ssl(): any;
    get serverPort(): any;
    get contextPath(): any;
    get clusterName(): any;
    get defaultEncoding(): any;
    get identityKey(): any;
    get identityValue(): any;
    get endpointQueryParams(): any;
    get decodeRes(): any;
    /**
     * 请求
     * @param {String} path - 请求 path
     * @param {Object} [options] - 参数
     * @return {String} value
     */
    request(path: any, options?: {
        encode?: boolean;
        method?: string;
        data?: any;
        timeout?: number;
        headers?: any;
        unit?: string;
        dataAsQueryString?: boolean;
    }): Promise<any>;
    getRequestUrl(currentServer: any): string;
    decodeResData(res: any, method?: string): any;
}
