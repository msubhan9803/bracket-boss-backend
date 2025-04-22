import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './entities/pool.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Pool
        ])
    ]
})
export class PoolModule {}
