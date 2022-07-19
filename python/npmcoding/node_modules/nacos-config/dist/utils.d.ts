/**
 * 获取字符串的 md5 值
 * @param {String} val - 字符串
 * @return {String} md5
 */
export declare function getMD5String(val: any, encodingFormat?: string): any;
export declare function encodingParams(data: any, encodingFormat?: string): any;
/**
 * 是否是合法字符
 * @param {String} val - 字符串
 * @return {Boolean} valid or not?
 */
export declare function isValid(val: any): boolean;
export declare function checkParameters(dataIds: any, group: any, datumId?: any): void;
export declare function transformGBKToUTF8(text: any): any;
