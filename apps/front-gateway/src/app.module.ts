import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { CasModule } from './cas-proxy/module';
import { ProxyModule } from './proxy/proxy.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MongoDBProperties } from '@app/common';
import { RedisProperties } from '@app/cache';
import { entities } from './entities';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AppController } from './app.controller';
@Module({
	imports: [
		HttpModule,
		CasModule,
		ProxyModule,
		RedisModule.forRoot({
			config: new RedisProperties(),
		}),
		CacheModule.register(),
		TypeOrmModule.forRoot({
			...new MongoDBProperties(),
			entities,
		}),
	],
	controllers: [AppController],
})
export class AppModule {}
