import { OnData } from "./ppc";
declare const A01_METADATA_SIGNATURE = "Format: A01";
declare const AO1_FORMAT_IDENTIFIER = "A01";
declare const A01_METADATA_MAX_SIZE = 4096;
declare const CASE_PPC_FILENAME = "Case.ppc";
declare enum Type {
    Standard = "Standard",
    OffNetwor = "Off-Network"
}
declare enum Encryption {
    None = "None",
    AES256 = "AES-256"
}
declare class Tool {
    Name: string;
    Version: string;
    constructor(name: string, version: string);
}
declare class A01 {
    readonly Format: string;
    readonly Type: Type;
    readonly ID: string;
    readonly Tool: Tool;
    readonly Encryption: Encryption;
    readonly Enumerator: any;
    private readonly reader;
    constructor(type: Type, id: string, tool: Tool, encryption: Encryption, reader: Function);
    readPPC(onData: OnData, password?: string): Promise<void>;
}
export { A01, Tool, AO1_FORMAT_IDENTIFIER, A01_METADATA_MAX_SIZE, A01_METADATA_SIGNATURE, CASE_PPC_FILENAME };
