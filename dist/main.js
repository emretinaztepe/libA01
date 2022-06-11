"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstance = void 0;
const container_1 = require("./container");
const library_1 = require("./library");
function createInstance(logger) {
    (0, container_1.ConfigureContainer)(logger);
    return new library_1.LibA01();
}
exports.createInstance = createInstance;
//# sourceMappingURL=main.js.map