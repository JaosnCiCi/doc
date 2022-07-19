"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
class Configuration {
    constructor(initConfig) {
        this.innerConfig = initConfig || {};
    }
    merge(config) {
        this.innerConfig = Object.assign(this.innerConfig, config);
        return this;
    }
    attach(config) {
        return new Configuration(Object.assign({}, this.innerConfig, config));
    }
    get(configKey) {
        return configKey ? this.innerConfig[configKey] : this.innerConfig;
    }
    has(configKey) {
        return !!this.innerConfig[configKey];
    }
    set(configKey, target) {
        this.innerConfig[configKey] = target;
        return this;
    }
    modify(configKey, changeHandler) {
        this.innerConfig[configKey] = changeHandler.call(this, this.innerConfig[configKey]);
        return this;
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map