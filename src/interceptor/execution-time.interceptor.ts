import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Injectable()
export class ExecutionTimeInterceptor implements NestInterceptor {
    constructor(private readonly logger: CustomLoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const now = Date.now();

        const handlerName = context.getHandler().name;
        const className = context.getClass().name;

        return next.handle().pipe(
            tap(() => {
                const elapsed = Date.now() - now;
                this.logger.log(`${className}.${handlerName} - Execution time: ${elapsed}ms`);
            }),
        );
    }
}
