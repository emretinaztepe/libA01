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
 * Sample Metadata
 * 
 * Format: A01
 * ID: 09a2a3d1-d6f9-40b3-a1a9-5ae2f75bbf74
 * CreatedAt: 2020-04-17T14:37:00.000Z
 * OffNetwork: false
 * PasswordProtected: false
 */