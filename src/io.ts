export type OnData = (data: []) => void;

// @Implements<zip.Writer>
export class Streamer {
    public size:number;
    public initialized:boolean;
    
    private onData:OnData;

	constructor(onData:OnData) {
		this.size = 0;
        this.initialized = false;
        this.onData = onData;
	}

	public init() {
		this.initialized = true;
	}

    public writeUint8Array(data: []){
        this.size += data.length;
        this.onData(data);
    }

    // @NotImplemented: We don't want to keep the data in memory
    public getData() {}
}