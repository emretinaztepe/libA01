import * as PPC from "./io";
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
    
    private readonly reader: Function;
    private readonly logger: ILogger = container.get<ILogger>(DI.ILogger);

    constructor(type: Type, id: string, tool: Tool, encryption: Encryption, passwordProtected: boolean, reader:Function) {
        this.Type = type;
        this.ID = id;
        this.Tool = tool;
        this.Encryption = encryption;
        this.PasswordProtected = passwordProtected;
        this.reader = reader;

        this.logger.debug(`A01 successfully created: ${JSON.stringify(this)}`);
    }

    /**
     * Streams the PPC file from the A01 file
     * @param onData: Function to call when data is available
     * @param password: Password to use to decrypt the file
     */
    public async StreamPPC(onData: PPC.OnData, password: string = '') {
        password = this.GeneratePassword(password);
        await this.reader(new PPC.Streamer(onData), password != '' ? {"password": password} : {});
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