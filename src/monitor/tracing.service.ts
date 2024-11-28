import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

export const initTracing = async (): Promise<void> => {
    const traceExporter = new JaegerExporter({
        endpoint: 'http://tracing:14268/api/traces',
    });

    const sdk = new opentelemetry.NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'task-time-manager-api',
        }),
        instrumentations: [getNodeAutoInstrumentations()],
        spanProcessor: new SimpleSpanProcessor(traceExporter),
    });
    try {
        await sdk.start();
        console.log('Tracing initialized');
    } catch (error) {
        console.log('Error initializing tracing', error);
    }

    process.on('SIGTERM', () => {
        sdk
            .shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
};