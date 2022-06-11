export declare type OnData = (data: []) => void;
export declare class Streamer {
    size: number;
    initialized: boolean;
    private onData;
    constructor(onData: OnData);
    init(): void;
    writeUint8Array(data: []): void;
    getData(): void;
}
