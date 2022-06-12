import { ZipEntry, ZipReader } from '@zip.js/zip.js';
import * as io from "./io";
declare enum Type {
    Standard = "Standard",
    OffNetwork = "Off-Network"
}
declare enum Encryption {
    None = "None",
    AES256 = "AES-256"
}
declare type OnFile = (entry: any) => boolean;
declare class A01 {
    readonly Format: string;
    readonly Type: Type;
    readonly ID: string;
    readonly Tool: Tool;
    readonly Encryption: Encryption;
    readonly PasswordProtected: boolean;
    private readonly zipReader;
    private readonly logger;
    constructor(type: Type, id: string, tool: Tool, encryption: Encryption, passwordProtected: boolean, zipReader: ZipReader);
    StreamFile(filePath: string, onData: io.OnData, password?: string): Promise<void>;
    TotalCount(): Promise<number>;
    EnumFiles(onFile: OnFile, startIndex?: number, totalCount?: number): Promise<void>;
    FindFile(filePath: string): Promise<ZipEntry>;
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
