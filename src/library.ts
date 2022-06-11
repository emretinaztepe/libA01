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

        // Read PPC file
        let ppc:Entry = await this.findPPC(file);
        if (ppc === null) {
            throw new Error('PPC file not found. Please check the file format.');
        }

        // Set reader function
        // IMPORTANT: Otherwise causes a compile time error (due to dictionary convention on zip-entry.js)
        let ppcReader = (ppc as any)['getData'] as Function;
        if (ppcReader === undefined) {
            throw new Error('PPC getData is undefined. This could be a corrupted zip entry.');
        }
        
        return new A01(dict.Type, dict.ID, dict.Tool, dict.Encryption, dict.PasswordProtected, ppcReader);
    }

    private async findPPC(file:File): Promise<Entry> {
        let reader:BlobReader = new BlobReader(file as Blob);
        let zipFile:ZipReader = new ZipReader(reader);
        // Iterate until we find the PPC file
        const iter = zipFile.getEntriesGenerator();
        for(let curr = iter.next(); !(await curr).done; curr = iter.next()) {
            let zipEntry = (await curr).value as any;
            if (zipEntry.filename === Constants.CASE_PPC_FILENAME) {
                return zipEntry;
            }
        }
        return null;
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