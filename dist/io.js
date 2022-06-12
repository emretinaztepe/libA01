"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Streamer = void 0;
class Streamer {
    constructor(onData, totalSize) {
        this.size = 0;
        this.totalSize = totalSize;
        this.initialized = false;
        this.onData = onData;
    }
    init() {
        this.initialized = true;
    }
    writeUint8Array(data) {
        this.size += data.length;
        this.onData(data, this.size, this.totalSize);
    }
    getData() { }
}
exports.Streamer = Streamer;
//# sourceMappingURL=io.js.map