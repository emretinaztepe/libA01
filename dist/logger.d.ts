interface ILogger {
    log(message: any): void;
    debug(message: any): void;
    verbose(message: any): void;
    info(message: any): void;
    warn(message: any): void;
    error(message: any, trace?: any): void;
    exception(exception: Error): void;
}
declare class DefaultLogger implements ILogger {
    private isDebug;
    constructor(isDebug: boolean);
    log(message: any): void;
    debug(message: any): void;
    verbose(message: any): void;
    info(message: any): void;
    warn(message: any): void;
    error(message: any, trace?: any): void;
    exception(exception: Error): void;
}
export { ILogger, DefaultLogger };
