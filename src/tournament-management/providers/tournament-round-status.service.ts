import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TournamentRoundStatus } from '../entities/tournamentRoundStatus.entity';
import { TournamentRoundStatusTypes } from '../types/common';

@Injectable()
export class TournamentRoundStatusService {
    constructor(
        @InjectRepository(TournamentRoundStatus)
        private tournamentRoundStatusRepository: Repository<TournamentRoundStatus>
    ) { }

    findRoundStatusByStatusName(statusName: TournamentRoundStatusTypes) {
        return this.tournamentRoundStatusRepository.findOne({
            where: { status: statusName },
        });
    }
}
