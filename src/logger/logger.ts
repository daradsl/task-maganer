import pino from 'pino';
import { customTimestamp } from 'src/utils/date-utils';

const logOptions = {
    colorize: true,
    levelFirst: true,
    translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
    sync: false,
};

const prettyTransport = pino.transport({
    target: 'pino-pretty',
    options: {
        ...logOptions,
    },
    level: 'info',
});

const fileLogger = pino(
    {
        level: 'info',
        timestamp: customTimestamp,
        transport: {
            target: 'pino/file',
            options: {
                destination: './logger/app.log',
                ...logOptions,
            },
        },
    });

const consoleLogger = pino(prettyTransport);

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
