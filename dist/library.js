"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibA01 = void 0;
const zip_js_1 = require("@zip.js/zip.js");
const a01_1 = require("./a01");
const container_1 = require("./container");
const container_types_1 = require("./container-types");
const yaml = require("js-yaml");
const Constants = require("./constants");
class LibA01 {
    constructor() {
        this.logger = null;
        this.logger = container_1.container.get(container_types_1.DI.ILogger);
        this.logger.debug(`LibA01 successfully created`);
    }
    async open(file) {
        try {
            return await this.load(file);
        }
        catch (e) {
            this.logger.error(e);
            return null;
        }
    }
    async load(file) {
        let metadata = await this.readMetadataRaw(file);
        if (metadata === '') {
            throw new Error('A01 metadata not found. Are you sure this is an A01 file?');
        }
        let dict = yaml.load(metadata);
        let blobReader = new zip_js_1.BlobReader(file);
        let zipReader = new zip_js_1.ZipReader(blobReader);
        return new a01_1.A01(dict.Type, dict.ID, dict.Tool, dict.Encryption, dict.PasswordProtected, zipReader);
    }
    async readMetadataRaw(file) {
        let pos;
        for (pos = file.size - 1; pos > 0 && file.size - pos < Constants.A01_METADATA_MAX_SIZE; pos--) {
            let metadata = await file.slice(pos, file.size).text();
            if (metadata.startsWith(Constants.A01_METADATA_SIGNATURE)) {
                return this.sanitizeMetadata(metadata);
            }
        }
        return '';
    }
    sanitizeMetadata(input) {
        if (input[input.length - 1] == '\x00') {
            input = input.substring(0, input.length - 1);
        }
        return input;
    }
}
exports.LibA01 = LibA01;
//# sourceMappingURL=library.js.map