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
  return "xxxxxxxxxxxxxxxxxxxxxx";
}

function extractMetaData(file:File): string {
  return "";
}

export {process};