declare type OnData = (data: [], streamedSize: number, totalSize: number) => void;
declare class Streamer {
    size: number;
    initialized: boolean;
    private totalSize;
    private onData;
    constructor(onData: OnData, totalSize: number);
    init(): void;
    writeUint8Array(data: []): void;
    getData(): void;
}
export { OnData, Streamer };
