import {Container} from "inversify";
import { DI } from "./container-types";
import { DefaultLogger, ILogger } from './logger';

let container:Container = null;

function ConfigureContainer(logger:ILogger): void {
    // Allow only one instance of the container
    if (container) {
        return;
    }

    // Create the container and bind interfaces
    container = new Container();
    if(logger) {
        container.bind<ILogger>(DI.ILogger).toConstantValue(logger);
    } else {
        container.bind<ILogger>(DI.ILogger).toConstantValue(new DefaultLogger(true));
    }
}

export {ConfigureContainer, container}