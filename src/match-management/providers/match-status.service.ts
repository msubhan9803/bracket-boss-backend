import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchStatus } from '../entities/matchStatus.entity';
import { MatchStatusTypes } from '../types/common';

@Injectable()
export class MatchStatusService {
    constructor(
        @InjectRepository(MatchStatus)
        private matchStatusService: Repository<MatchStatus>
    ) { }

    findMatchStatusByStatusName(statusName: MatchStatusTypes) {
        return this.matchStatusService.findOne({
            where: { status: statusName },
        });
    }
}
