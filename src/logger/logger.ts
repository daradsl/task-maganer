import pino from 'pino';

const prettyTransport = pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
    }
});

const fileLogger = pino(
    {
        level: 'info',
    },
    pino.destination({ dest: './logger/app.log', sync: false })
);

const consoleLogger = pino(
    {
        level: 'info',
    },
    prettyTransport
);

const logger = {
    info: (msg: string) => {
        fileLogger.info(msg);
        consoleLogger.info(msg);
    },
    error: (msg: string) => {
        fileLogger.error(msg);
        consoleLogger.error(msg);
    },
    warn: (msg: string) => {
        fileLogger.warn(msg);
        consoleLogger.warn(msg);
    },
    debug: (msg: string) => {
        fileLogger.debug(msg);
        consoleLogger.debug(msg);
    },
    trace: (msg: string) => {
        fileLogger.trace(msg);
        consoleLogger.trace(msg);
    }
};

export default logger;
