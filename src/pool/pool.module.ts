import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './entities/pool.entity';
import { PoolService } from './providers/pool.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Pool
        ])
    ],
    providers: [PoolService],
    exports: [PoolService]
})
export class PoolModule {}
