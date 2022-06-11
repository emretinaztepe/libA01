declare type OnData = (data: []) => void;
declare class PPCStream {
    size: number;
    initialized: boolean;
    private onData;
    constructor(onData: OnData);
    init(): void;
    writeUint8Array(data: []): void;
    getData(): void;
}
export { PPCStream, OnData };
