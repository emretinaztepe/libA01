import {ZipReader, BlobReader} from "@zip.js/zip.js";

async function process(file:File, cb:Function) {
  let blob:Blob = file.slice(0, 100);
  let text = await blob.text()

  console.log('Content: ' + text);
  console.log('Hash: ' + text);

  let zipFile:ZipReader = new ZipReader(new BlobReader(file as Blob));

  let entries = await zipFile.getEntries();
  let password = calculatePassword()

  cb(file.name, entries.length, password);
}

function calculatePassword(): string {
  return "password here";
}

function extractMetaData(file:File): string {
  return "";
}

export {process};

/**
 * A01 Format Metadata
 * 
 * Format: A01
 * Method: Standard|Off-Network
 * ID: 09a2a3d1-d6f9-40b3-a1a9-5ae2f75bbf74
 * Device:
 *   Name: EmrePC
 * Tool: 
 *   Name: AIR
 *   Version: 1.5.2
 * Encryption: None|AES-256
 */