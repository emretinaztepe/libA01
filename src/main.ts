import {ZipReader, BlobReader, Entry, Writer} from "@zip.js/zip.js";
import * as yaml from "js-yaml";
import * as PPC from "./ppc";
import * as Constants from "./constants";
import * as A01 from "./a01";

/**
 * Opens an AO1 file
 * @param file: File
 * @returns A01 | null
 */
async function open(file:File): Promise<A01.A01> {
  let a01: A01.A01;

  // Read metadata
  let metadata: string = await readMetadataRaw(file);
  if (metadata === '') {
    return null;
  }

  // Deserialize to dictionary and convert to A01
  let dict:any = yaml.load(metadata);
  //TODO(emre): validate dict

  // Read PPC file
  let ppc:Entry = await findPPC(file);
  if (ppc === null) {
    return null;
  }

  // Set reader function
  // IMPORTANT: Otherwise causes a compile time error (due to dictionary convention on zip-entry.js)
  let ppcReader = (ppc as any)['getData'] as Function;
  //TODO(emre): validate ppcReader
  
  return new A01.A01(dict.Type, dict.ID, dict.Tool, dict.Encryption, ppcReader);
}

/**
 * Iterate through entries and find PPC file
 * @param file: File
 * @returns Entry | null
 */
async function findPPC(file:File): Promise<Entry> {
  let reader:BlobReader = new BlobReader(file as Blob);
  let zipFile:ZipReader = new ZipReader(reader);
  // Iterate until we find the PPC file
  const iter = zipFile.getEntriesGenerator();
  for(let curr = iter.next(); !(await curr).done; curr = iter.next()) {
    let zipEntry = (await curr).value as any;
    if (zipEntry.filename === Constants.CASE_PPC_FILENAME) {
      return zipEntry;
    }
  }
  return null;
}

/**
 * Seeks to end of file and reads A01 metadata 
 * @param file: File
 * @returns string | ''
 */
async function readMetadataRaw(file:File): Promise<string> {
  // Search A01 metadata inside End of Central Directory
  let pos:number;
  for (pos = file.size - 1; pos > 0 && file.size - pos < Constants.A01_METADATA_MAX_SIZE; pos--) {    
    let metadata = await file.slice(pos, file.size).text();
    if (metadata.startsWith(Constants.A01_METADATA_SIGNATURE)) {
      return sanitizeMetadata(metadata);
    }
  }
  return '';
} 

/**
 * Removes null byte from the end of metadata
 * @param input: string
 * @returns string
 */
function sanitizeMetadata(input:string): string {
  if(input[input.length-1] == '\x00') { 
    input = input.substring(0, input.length-1); 
  }
  return input;
}

function calculatePassword(): string {
  return "password here";
}

function extractMetaData(file:File): string {
  return "";
}

export {open};