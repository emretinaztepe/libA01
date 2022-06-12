import { ZipEntry, ZipReader } from '@zip.js/zip.js';
import * as io from "./io";
import * as Constants from "./constants";
import { container } from './container';
import { DI } from './container-types';
import { ILogger } from "./logger";
import { sha256 } from "js-sha256";

enum Type {
    Standard = "Standard",
    OffNetwork = "Off-Network",
}

enum Encryption {
    None = "None",
    AES256 = "AES-256",
}

/**
 * Callback for when a file is enumerated
 * @param {number} index
 * @param {string} entry ZipEntry 
 */
type OnFile = (index:number, entry: any) => void;

/**
 * AO1 File
 * At its core, A01 is a zip file with a single PPC file that contains the actual case data.
 * It has a metadata file, which contains the following information:
 * - Format: A01
 * - Type: Standard or Off-Network
 * - ID: A random GUID as the identifier for the AO1 file
 * - Tool: Name of the tool that created the AO1 file
 * - Encryption: None or AES-256
 */
class A01 {
    public readonly Format: string = Constants.AO1_FORMAT_IDENTIFIER;
    public readonly Type: Type;
    public readonly ID: string;
    public readonly Tool: Tool;
    public readonly Encryption: Encryption;
    public readonly PasswordProtected: boolean;
    
    private readonly zipReader: ZipReader;
    private readonly logger: ILogger = container.get<ILogger>(DI.ILogger);

    constructor(type: Type, id: string, tool: Tool, encryption: Encryption, passwordProtected: boolean, zipReader:ZipReader) {
        this.Type = type;
        this.ID = id;
        this.Tool = tool;
        this.Encryption = encryption;
        this.PasswordProtected = passwordProtected;
        this.zipReader = zipReader;

        this.logger.debug(`A01 successfully created: ${JSON.stringify(this)}`);
    }

    /**
     * @async Get total number of files in the A01 file (skips directory entries)
     * @returns Promise<number>
     */
    public async GetFileCount(): Promise<number>{
        let count = 0;
        const iter = this.zipReader.getEntriesGenerator();
        for(let curr = iter.next(); !(await curr).done; curr = iter.next()) {
            let entry = (await curr).value as any;
            if (!this.isDirectory(entry)) {
                count++;
            }
        }
        return count;
    }

    /**
     * @async Enumerates files
     * @param onFile: Function to call when a file is found
     * @param startIndex: Index to start enumerating from
     * @param totalCount: Max number of files to enumerate
     */
    public async EnumFiles(onFile:OnFile, startIndex:number = 0, totalCount:number = 0): Promise<void> {
        let index = -1; // We will start from Index 0
        let count = 0;
        const iter = this.zipReader.getEntriesGenerator();
        for(let curr = iter.next(); !(await curr).done; curr = iter.next()) {
            // Get entry
            let entry = (await curr).value as any;
            // Skip directory entries
            if (this.isDirectory(entry)) {
                continue;
            }
            // Skip to index
            if (++index < startIndex) {
                continue;
            }
            // Call the callback and stop if it returns false
            onFile(index, entry);
            // Make sure we don't exceed the total count
            if (++count == totalCount) {
                return;
            }
        }
    }

    /**
     * @async Finds a file entry in the A01 file
     * @param filePath: File path with forward slashes (case insensitive)
     * @returns Promise<ZipEntry>
     */
    public async FindFile(filePath:string): Promise<ZipEntry> {
        const iter = this.zipReader.getEntriesGenerator();
        for(let curr = iter.next(); !(await curr).done; curr = iter.next()) {
            let entry = (await curr).value as any;
            // Skip directory entries
            if (this.isDirectory(entry)) {
                continue;
            }
            // Check if the file path matches
            if (entry.filename.toLowerCase() === filePath.toLowerCase()) {
                return entry as ZipEntry;
            }
        }
        return null;
    }

    /**
     * Streams a file from the A01 file
     * @param filePath: File path with forward slashes (case insensitive)
     * @param onData: Function to call when data is available
     * @param password: Password to use to decrypt the file
     * @throws Error if the file is not found
     * @returns void
     */
     public async StreamFile(filePath:string, onData: io.OnData, password: string = ''): Promise<void> {
        // Generate password
        password = this.GeneratePassword(password);

        let zipEntry:any = null;
        // Find the file and get the reader for it
        const iter = this.zipReader.getEntriesGenerator();
        for(let curr = iter.next(); !(await curr).done; curr = iter.next()) {
            let entry = (await curr).value as any;
            if (entry.filename.toLowerCase() === filePath.toLowerCase()) {
                zipEntry = entry;
                break;
            }
        }

        if (zipEntry === null) {
            throw new Error(`Can not find ZipEntry for file: ${filePath}`);
        }

        // Find reader for the entry
        // IMPORTANT: Otherwise causes a compile time error (due to dictionary convention on zip-entry.js)
        let entryReader = zipEntry['getData'] as Function;
        if (entryReader === undefined) {
            throw new Error(`ZipEntry getData is undefined for ${filePath}. This could be a corrupted zip entry.`);
        }

        await entryReader(new io.Streamer(onData, zipEntry['uncompressedSize']), password != '' ? {"password": password} : {});
    }

    /**
     * Checks if the A01 file is encrypted
     * @returns boolean
     */
    public IsEncrypted(): boolean {
        return this.Encryption != Encryption.None;
    }

    /**
     * Is this an Off-network package?
     * @returns boolean
     */
    public IsOffNetwork(): boolean {
        return this.Type == Type.OffNetwork;
    }

    /**
     * Is password protected
     * @returns boolean
     */
    public IsPasswordProtected(): boolean {
        return this.PasswordProtected;
    }

    /**
     * Generates a password for the A01 file
     * There are two cases here:
     * 1. Standard collection with Agent
     *    In this case, depending on the task settings, file can be encrypted or not.
     *    If the user provided a password, we will need it 'as is' to decrypt the file.
     *    If not, this is a simple zip file with A01 metadata.
     * 2. Off-network Collection 
     *    In this case, the file is always encrypted.
     *    If the user provided a password, we will need it 'as is' to decrypt the file.
     *    If not, we will use SHA2(ID + SALT) to generate a password.
     * @returns string
     */
    public GeneratePassword(password: string): string {
        if (this.Encryption == Encryption.None) {
            // Plain zip file
            return password;
        } else {
            // Encrypted
            switch (this.Type) {
                case Type.Standard:
                    // Standard collection with Agent
                    // User already provided a password so we don't need to generate one
                    return password;
                case Type.OffNetwork:
                    // Off-network collection
                    if (this.PasswordProtected) {
                        return sha256(password + Constants.A01_SALT);
                    } else {
                        return sha256(this.ID + Constants.A01_SALT);
                    }
                default:
                    throw new Error(`Unknown type: ${this.Type}`);
            }
        }
    }

    private isDirectory(entry:any): boolean {
        return entry["directory"] === true;
    }
}

/**
 * Tool used to create the A01 file
 */
class Tool {
    public Name: string;
    public Version: string;

    constructor(name: string, version: string) {
        this.Name = name;
        this.Version = version;
    }
}

export { A01, Tool, Type, Encryption };