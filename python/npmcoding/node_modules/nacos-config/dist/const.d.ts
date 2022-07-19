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
import * as urllib from 'urllib';
export declare const DEFAULT_GROUP = "DEFAULT_GROUP";
export declare const LINE_SEPARATOR: string;
export declare const WORD_SEPARATOR: string;
export declare const VERSION: string;
export declare const CURRENT_UNIT = "CURRENT_UNIT";
export declare const HTTP_OK = 200;
export declare const HTTP_NOT_FOUND = 404;
export declare const HTTP_CONFLICT = 409;
export declare const HTTP_UNAVAILABLE = 503;
export declare const DEFAULT_OPTIONS: {
    serverPort: number;
    requestTimeout: number;
    refreshInterval: number;
    cacheDir: string;
    httpclient: typeof urllib;
    contextPath: string;
    clusterName: string;
    unit: string;
    ssl: boolean;
    secretKey: string;
    defaultEncoding: string;
};
