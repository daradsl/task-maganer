import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private readonly logger: CustomLoggerService) { }

    use(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => {
            const { method, url, body } = req;
            const { statusCode } = res;

            const logBody = { ...body };
            if (logBody.password) {
                logBody.password = '********';
            }

            this.logger.log(`Request: ${method} ${url} - Status: ${statusCode} ${Object.keys(logBody).length > 0 ? `- Body: ${JSON.stringify(logBody)}` : ''}`);
        });
        next();
    }
}
