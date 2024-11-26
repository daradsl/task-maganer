declare module 'climem' {
    export function monitor(options: {
        port: number;
        frequency: number;
        logLevel: string;
    }): void;
}
