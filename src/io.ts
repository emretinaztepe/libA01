/**
 * @param {string} path
 * @param {number} streamedSize Cumulative size streamed so far (including the current chunk)
 * @param {number} totalSize Total size of the file (uncompressed)
 */
type OnData = (data: [], streamedSize:number, totalSize:number) => void;

// @Implements<zip.Writer>
class Streamer {
    public size:number; // used by Zip.js
    public initialized:boolean; // used by Zip.js
    
    private totalSize:number;
    private onData:OnData;

    constructor(onData:OnData, totalSize:number) {
        this.size = 0;
        this.totalSize = totalSize;
        this.initialized = false;
        this.onData = onData;
    }

    public init() {
        this.initialized = true;
    }

    public writeUint8Array(data: []){
        this.size += data.length;
        this.onData(data, this.size, this.totalSize);
    }

    // @NotImplemented: We don't want to keep the data in memory
    public getData() {}
}

export {OnData, Streamer};