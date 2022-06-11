"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLogger = void 0;
class DefaultLogger {
    constructor(isDebug) {
        this.isDebug = false;
        this.isDebug = isDebug;
    }
    log(message) {
        console.log("LOG: " + message);
    }
    debug(message) {
        if (this.isDebug) {
            console.log("DBG: " + message);
        }
    }
    verbose(message) {
        console.log(JSON.stringify(message));
    }
    info(message) {
        console.log("INF: " + message);
    }
    warn(message) {
        console.log("WRN: " + message);
    }
    error(message, trace) {
        console.log("ERR: " + message);
    }
    exception(exception) {
        console.log("EXC: " + exception.message);
    }
}
exports.DefaultLogger = DefaultLogger;
//# sourceMappingURL=logger.js.map