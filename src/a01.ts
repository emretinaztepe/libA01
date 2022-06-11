import * as PPC from "./ppc";
import * as Constants from "./constants";

export enum Type {
    Standard = "Standard",
    OffNetwor = "Off-Network",
}

export enum Encryption {
    None = "None",
    AES256 = "AES-256",
}

export class A01 {
    public readonly Format: string = Constants.AO1_FORMAT_IDENTIFIER;
    public readonly Type: Type;
    public readonly ID: string;
    public readonly Tool: Tool;
    public readonly Encryption: Encryption;
    public readonly Enumerator: any;
    
    private readonly reader: Function;

    constructor(type: Type, id: string, tool: Tool, encryption: Encryption, reader:Function) {
        this.Type = type;
        this.ID = id;
        this.Tool = tool;
        this.Encryption = encryption;
        this.reader = reader;
    }

    public async readPPC(onData: PPC.OnData, password: string = '') {
        await this.reader(new PPC.Stream(onData), password != '' ? {"password": password} : {});
    }
}

export class Tool {
    public Name: string;
    public Version: string;

    constructor(name: string, version: string) {
        this.Name = name;
        this.Version = version;
    }
}