import { Container } from "inversify";
import { ILogger } from './logger';
declare let container: Container;
declare function ConfigureContainer(logger: ILogger): void;
export { ConfigureContainer, container };
