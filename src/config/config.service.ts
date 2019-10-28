// import { Injectable, Logger } from '@nestjs/common';
// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// import { returnStatement } from '@babel/types';
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// dotenv.config();

// @Injectable()
// export class ConfigService{
//     private readonly envConfig: {[key: string]: string};

//     constructor(filePath: string){
//         try {
//             this.envConfig = dotenv.parse(fs.readFileSync(filePath));
//         } catch (e) {
//             Logger.error(`File ${filePath} not found, app will use process.env`)
//         }
//     }
    
//     get(key: string):string {
//         if (this.envConfig) return this.envConfig[key];
//         return process.env[key];
//     }

//     getInt(key: string): number {
//         if (this.envConfig) return parseInt(this.envConfig[key], 10);
//         return parseInt(process.env[key], 10);
//     }

//     getBoolean(key: string): boolean {
//         if (this.envConfig) return this.envConfig[key] === 'true';
//         return process.env[key] === 'true';
//     }
// }

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('APP_PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USER'),
      password: this.getValue('DB_PASS'),
      database: this.getValue('DB_NAME'),
    };
  }

}

const configService = new ConfigService(process.env).ensureValues([
    // 'DB_HOST',
    // 'DB_PORT',
    // 'DB_USER',
    // 'DB_PASS',
    // 'DB_NAME'
]);

export { configService };