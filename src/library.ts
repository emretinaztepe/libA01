import { Entry, BlobReader, ZipReader } from "@zip.js/zip.js";
import { A01 } from "./a01";
import { container } from "./container";
import { DI } from "./container-types";
import { ILogger } from "./logger";
import * as yaml from "js-yaml";
import * as Constants from "./constants";

/**
 * A01 Library
 */
class LibA01 {
    private logger: ILogger = null;

    constructor() {
        this.logger = container.get<ILogger>(DI.ILogger);
        this.logger.debug(`LibA01 successfully created`);
    }

    /**
     * @async Opens an A01 file
     * @param file: File
     * @returns A01 | null
     */
    public async open(file:File): Promise<A01> {
        try {
            return await this.load(file);
        } catch(e) {
            this.logger.error(e);
            return null;
        }
    }

    private async load(file:File): Promise<A01> {
        // Read metadata
        let metadata: string = await this.readMetadataRaw(file);
        if (metadata === '') {
            throw new Error('A01 metadata not found. Are you sure this is an A01 file?');
        }

        // Deserialize to dictionary and convert to A01
        let dict:any = yaml.load(metadata);

        // Create a reader
        let blobReader:BlobReader = new BlobReader(file as Blob);
        let zipReader:ZipReader = new ZipReader(blobReader);
        
        return new A01(dict.Type, dict.ID, dict.Tool, dict.Encryption, dict.PasswordProtected, zipReader);
    }

    private async readMetadataRaw(file:File): Promise<string> {
        // Search A01 metadata inside End of Central Directory
        let pos:number;
        for (pos = file.size - 1; pos > 0 && file.size - pos < Constants.A01_METADATA_MAX_SIZE; pos--) {    
            let metadata = await file.slice(pos, file.size).text();
            if (metadata.startsWith(Constants.A01_METADATA_SIGNATURE)) {
                return this.sanitizeMetadata(metadata);
            }
        }
        return '';
    } 

    private sanitizeMetadata(input:string): string {
        if(input[input.length-1] == '\x00') { 
            input = input.substring(0, input.length-1); 
        }
        return input;
    }
}

export {LibA01}