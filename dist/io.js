"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Streamer = void 0;
class Streamer {
    constructor(onData) {
        this.size = 0;
        this.initialized = false;
        this.onData = onData;
    }
    init() {
        this.initialized = true;
    }
    writeUint8Array(data) {
        this.size += data.length;
        this.onData(data);
    }
    getData() { }
}
exports.Streamer = Streamer;
//# sourceMappingURL=io.js.map