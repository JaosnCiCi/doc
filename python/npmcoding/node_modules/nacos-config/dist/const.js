"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.HTTP_UNAVAILABLE = exports.HTTP_CONFLICT = exports.HTTP_NOT_FOUND = exports.HTTP_OK = exports.CURRENT_UNIT = exports.VERSION = exports.WORD_SEPARATOR = exports.LINE_SEPARATOR = exports.DEFAULT_GROUP = void 0;
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
const urllib = require("urllib");
const path = require("path");
const osenv = require("osenv");
exports.DEFAULT_GROUP = 'DEFAULT_GROUP';
exports.LINE_SEPARATOR = String.fromCharCode(1);
exports.WORD_SEPARATOR = String.fromCharCode(2);
exports.VERSION = 'nodejs-diamond-client/' + require('../package.json').version;
exports.CURRENT_UNIT = 'CURRENT_UNIT';
exports.HTTP_OK = 200;
exports.HTTP_NOT_FOUND = 404;
exports.HTTP_CONFLICT = 409;
exports.HTTP_UNAVAILABLE = 503; // 被限流
exports.DEFAULT_OPTIONS = {
    serverPort: 8848,
    requestTimeout: 5000,
    refreshInterval: 30000,
    cacheDir: path.join(osenv.home(), '.node-diamond-client-cache'),
    httpclient: urllib,
    contextPath: 'nacos',
    clusterName: 'serverlist',
    unit: exports.CURRENT_UNIT,
    ssl: false,
    secretKey: '',
    defaultEncoding: 'utf8',
};
//# sourceMappingURL=const.js.map