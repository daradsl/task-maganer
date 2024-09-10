import { Injectable, LoggerService } from '@nestjs/common';
import logger from './logger';

@Injectable()
export class CustomLoggerService implements LoggerService {
    private readonly logger = logger;

    log(message: string, context?: string) {
        this.logger.info(`${context ? `[${context}] ` : ''}${message}`);
    }

    error(message: string, trace: string, context?: string) {
        this.logger.error(`${context ? `[${context}] ` : ''}${message}. Trace: ${trace}`);
    }

    warn(message: string, context?: string) {
        this.logger.warn(`${context ? `[${context}] ` : ''}${message}`);
    }

    debug(message: string, context?: string) {
        this.logger.debug(`${context ? `[${context}] ` : ''}${message}`);
    }

    verbose(message: string, context?: string) {
        this.logger.trace(`${context ? `[${context}] ` : ''}${message}`);
    }
}
