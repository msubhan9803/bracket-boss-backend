import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './entities/pool.entity';
import { PoolService } from './providers/pool.service';
import { PoolResolver } from './pool.resolver';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Pool
        ]),
        UsersModule
    ],
    providers: [PoolService, PoolResolver, JwtService],
    exports: [PoolService]
})
export class PoolModule {}
