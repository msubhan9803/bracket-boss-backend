import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchRoundStatus } from '../entities/matchRoundStatus.entity';
import { MatchRoundStatusTypes } from '../types/common';

@Injectable()
export class MatchRoundStatusService {
    constructor(
        @InjectRepository(MatchRoundStatus)
        private matchRoundStatusService: Repository<MatchRoundStatus>
    ) { }

    findMatchStatusByStatusName(statusName: MatchRoundStatusTypes) {
        return this.matchRoundStatusService.findOne({
            where: { status: statusName },
        });
    }
}
