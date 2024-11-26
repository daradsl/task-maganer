import { Injectable, OnModuleInit } from '@nestjs/common';
import config from './climem.config';
import * as climem from 'climem';

@Injectable()
export class MonitorService implements OnModuleInit {
    onModuleInit() {
        // Usando as configurações do arquivo climem.config.ts
        climem.monitor({
            port: config.port,  // Usando a porta configurada
            frequency: config.frequency,  // Usando a frequência configurada
            logLevel: config.logLevel,  // Usando o nível de log configurado
        });

        console.log(`Monitoramento de memória iniciado na porta ${config.port}`);
    }
}
