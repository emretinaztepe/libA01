/**
 * Generic logger interface
 */
interface ILogger {
    log(message: any): void;
    debug(message: any): void;
    verbose(message: any): void;
    info(message: any): void;
    warn(message: any): void;
    error(message: any, trace?: any): void;
    exception(exception: Error): void;
}


/**
 * Default Logger implementation
 */
class DefaultLogger implements ILogger {
    private isDebug:boolean = false;

    constructor(isDebug:boolean) {
        this.isDebug = isDebug;
    }

    public log(message: any): void {
        console.log("LOG: " + message);
    }

    public debug(message: any): void {
        if (this.isDebug) {
            console.log("DBG: " + message);
        }
    }

    public verbose(message: any): void {
        console.log(JSON.stringify(message));
    }

    public info(message: any): void {
        console.log("INF: " + message);
    }

    public warn(message: any): void {
        console.log("WRN: " + message);
    }

    public error(message: any, trace?: any): void {
        console.log("ERR: " + message);
    }

    public exception(exception: Error): void {
        console.log("EXC: " + exception.message);
    }
}

export {ILogger, DefaultLogger};