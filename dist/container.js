"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.ConfigureContainer = void 0;
const inversify_1 = require("inversify");
const container_types_1 = require("./container-types");
const logger_1 = require("./logger");
let container = null;
exports.container = container;
function ConfigureContainer(logger) {
    if (container) {
        return;
    }
    exports.container = container = new inversify_1.Container();
    if (logger) {
        container.bind(container_types_1.DI.ILogger).toConstantValue(logger);
    }
    else {
        container.bind(container_types_1.DI.ILogger).toConstantValue(new logger_1.DefaultLogger(true));
    }
}
exports.ConfigureContainer = ConfigureContainer;
//# sourceMappingURL=container.js.map