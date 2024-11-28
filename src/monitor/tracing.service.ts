import { NodeSDK } from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

const traceExport = new JaegerExporter({
    endpoint: 'http://localhost:14268/api/traces',
});

export const tracingService = new NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: `task-time-manager`,
    }),
    spanProcessor: new SimpleSpanProcessor(traceExport),
    instrumentations: [new HttpInstrumentation(), new NestInstrumentation()],
});
