export type OnData = (data: []) => void;

// @Implements<Writer> from zip.js
export class Stream {
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

    // @NotImplemented 
    // Left intentionally empty in order to prevent memory issues
    // We don't need to keep the data in memory
    public getData() {}
}