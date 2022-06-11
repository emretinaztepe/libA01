import * as PPC from "./io";
declare enum Type {
    Standard = "Standard",
    OffNetwork = "Off-Network"
}
declare enum Encryption {
    None = "None",
    AES256 = "AES-256"
}
declare class A01 {
    readonly Format: string;
    readonly Type: Type;
    readonly ID: string;
    readonly Tool: Tool;
    readonly Encryption: Encryption;
    readonly PasswordProtected: boolean;
    private readonly reader;
    private readonly logger;
    constructor(type: Type, id: string, tool: Tool, encryption: Encryption, passwordProtected: boolean, reader: Function);
    StreamPPC(onData: PPC.OnData, password?: string): Promise<void>;
    IsEncrypted(): boolean;
    IsOffNetwork(): boolean;
    IsPasswordProtected(): boolean;
    GeneratePassword(password: string): string;
}
declare class Tool {
    Name: string;
    Version: string;
    constructor(name: string, version: string);
}
export { A01, Tool, Type, Encryption };
