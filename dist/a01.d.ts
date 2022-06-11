import * as PPC from "./ppc";
export declare enum Type {
    Standard = "Standard",
    OffNetwor = "Off-Network"
}
export declare enum Encryption {
    None = "None",
    AES256 = "AES-256"
}
export declare class A01 {
    readonly Format: string;
    readonly Type: Type;
    readonly ID: string;
    readonly Tool: Tool;
    readonly Encryption: Encryption;
    readonly Enumerator: any;
    private readonly reader;
    constructor(type: Type, id: string, tool: Tool, encryption: Encryption, reader: Function);
    StreamPPC(onData: PPC.OnData, password?: string): Promise<void>;
    IsEncrypted(): boolean;
}
export declare class Tool {
    Name: string;
    Version: string;
    constructor(name: string, version: string);
}
