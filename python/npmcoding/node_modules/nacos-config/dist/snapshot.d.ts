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
import { IConfiguration, ISnapshot, SnapShotData } from './interface';
declare const Base: any;
export declare class Snapshot extends Base implements ISnapshot {
    private uuid;
    constructor(options: any);
    get cacheDir(): any;
    get configuration(): IConfiguration;
    get(key: any): Promise<any>;
    save(key: any, value: any): Promise<void>;
    delete(key: any): Promise<void>;
    batchSave(arr: Array<SnapShotData>): Promise<void>;
    private getSnapshotFile;
}
export {};
