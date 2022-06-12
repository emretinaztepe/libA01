"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = exports.Type = exports.Tool = exports.A01 = void 0;
const io = require("./io");
const Constants = require("./constants");
const container_1 = require("./container");
const container_types_1 = require("./container-types");
const js_sha256_1 = require("js-sha256");
var Type;
(function (Type) {
    Type["Standard"] = "Standard";
    Type["OffNetwork"] = "Off-Network";
})(Type || (Type = {}));
exports.Type = Type;
var Encryption;
(function (Encryption) {
    Encryption["None"] = "None";
    Encryption["AES256"] = "AES-256";
})(Encryption || (Encryption = {}));
exports.Encryption = Encryption;
class A01 {
    constructor(type, id, tool, encryption, passwordProtected, zipReader) {
        this.Format = Constants.AO1_FORMAT_IDENTIFIER;
        this.logger = container_1.container.get(container_types_1.DI.ILogger);
        this.Type = type;
        this.ID = id;
        this.Tool = tool;
        this.Encryption = encryption;
        this.PasswordProtected = passwordProtected;
        this.zipReader = zipReader;
        this.logger.debug(`A01 successfully created: ${JSON.stringify(this)}`);
    }
    async StreamFile(filePath, onData, password = '') {
        password = this.GeneratePassword(password);
        let zipEntry = null;
        const iter = this.zipReader.getEntriesGenerator();
        for (let curr = iter.next(); !(await curr).done; curr = iter.next()) {
            let entry = (await curr).value;
            if (entry.filename.toLowerCase() === filePath.toLowerCase()) {
                zipEntry = entry;
                break;
            }
        }
        if (zipEntry === null) {
            throw new Error(`Can not find ZipEntry for file: ${filePath}`);
        }
        let entryReader = zipEntry['getData'];
        if (entryReader === undefined) {
            throw new Error(`ZipEntry getData is undefined for ${filePath}. This could be a corrupted zip entry.`);
        }
        await entryReader(new io.Streamer(onData, zipEntry['uncompressedSize']), password != '' ? { "password": password } : {});
    }
    async TotalCount() {
        let count = 0;
        const iter = this.zipReader.getEntriesGenerator();
        for (let curr = iter.next(); !(await curr).done; curr = iter.next(), count++) { }
        return count;
    }
    async EnumFiles(onFile, startIndex = 0, totalCount = 0) {
        let index = 0;
        let count = 0;
        const iter = this.zipReader.getEntriesGenerator();
        for (let curr = iter.next(); !(await curr).done; curr = iter.next(), index++) {
            if (index < startIndex) {
                continue;
            }
            let entry = (await curr).value;
            if (onFile(entry) === false) {
                return;
            }
            if (totalCount != 0 && ++count == totalCount) {
                return;
            }
        }
    }
    async FindFile(filePath) {
        const iter = this.zipReader.getEntriesGenerator();
        for (let curr = iter.next(); !(await curr).done; curr = iter.next()) {
            let entry = (await curr).value;
            if (entry.filename.toLowerCase() === filePath.toLowerCase()) {
                return entry;
            }
        }
        return null;
    }
    IsEncrypted() {
        return this.Encryption != Encryption.None;
    }
    IsOffNetwork() {
        return this.Type == Type.OffNetwork;
    }
    IsPasswordProtected() {
        return this.PasswordProtected;
    }
    GeneratePassword(password) {
        if (this.Encryption == Encryption.None) {
            return password;
        }
        else {
            switch (this.Type) {
                case Type.Standard:
                    return password;
                case Type.OffNetwork:
                    if (this.PasswordProtected) {
                        return (0, js_sha256_1.sha256)(password + Constants.A01_SALT);
                    }
                    else {
                        return (0, js_sha256_1.sha256)(this.ID + Constants.A01_SALT);
                    }
                default:
                    throw new Error(`Unknown type: ${this.Type}`);
            }
        }
    }
}
exports.A01 = A01;
class Tool {
    constructor(name, version) {
        this.Name = name;
        this.Version = version;
    }
}
exports.Tool = Tool;
//# sourceMappingURL=a01.js.map