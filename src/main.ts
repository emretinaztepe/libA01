import { ILogger } from './logger';
import { ConfigureContainer } from './container';
import { LibA01 } from './library';

/**
 * Main function for creating the library instance
 * @param logger
 * @returns LibA01
 */
function createInstance(logger?:ILogger): LibA01 {
  ConfigureContainer(logger);
  return new LibA01();
}

export {createInstance};