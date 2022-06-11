"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = exports.Type = exports.Tool = exports.A01 = void 0;
const PPC = require("./io");
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
    constructor(type, id, tool, encryption, passwordProtected, reader) {
        this.Format = Constants.AO1_FORMAT_IDENTIFIER;
        this.logger = container_1.container.get(container_types_1.DI.ILogger);
        this.Type = type;
        this.ID = id;
        this.Tool = tool;
        this.Encryption = encryption;
        this.PasswordProtected = passwordProtected;
        this.reader = reader;
        this.logger.debug(`A01 successfully created: ${JSON.stringify(this)}`);
    }
    async StreamPPC(onData, password = '') {
        password = this.GeneratePassword(password);
        await this.reader(new PPC.Streamer(onData), password != '' ? { "password": password } : {});
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