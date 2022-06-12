import { A01 } from "./a01";
declare class LibA01 {
    private logger;
    constructor();
    open(file: File): Promise<A01>;
    private load;
    private readMetadataRaw;
    private sanitizeMetadata;
}
export { LibA01 };
