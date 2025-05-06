import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelTeamStanding } from '../entities/levelStandings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LevelTeamStandingService {
    constructor(
        @InjectRepository(LevelTeamStanding)
        private readonly levelTeamStandingRepository: Repository<LevelTeamStanding>,
    ) { }

    async updateLevelTeamStanding(
        levelId: number,
        teamId: number,
        updates: { pointsScored: number; pointsAgainst: number; wins: number; losses: number },
        numberOfRounds: number
    ) {
        let standing = await this.levelTeamStandingRepository.findOne({
            where: { level: { id: levelId }, team: { id: teamId } },
        });

        if (!standing) {
            standing = this.levelTeamStandingRepository.create({
                level: { id: levelId },
                team: { id: teamId },
                wins: 0,
                losses: 0,
                pointsScored: 0,
                pointsAgainst: 0,
                pointsScoredByNumberOfGames: 0,
                pointsAgainstByNumberOfGames: 0,
                pointDiffByNumberOfGames: 0
            });
        }

        standing.pointsScored += updates.pointsScored;
        standing.pointsAgainst += updates.pointsAgainst;
        standing.wins += updates.wins;
        standing.losses += updates.losses;
        standing.pointsScoredByNumberOfGames += updates.pointsScored / numberOfRounds;
        standing.pointsAgainstByNumberOfGames += updates.pointsAgainst / numberOfRounds;
        standing.pointDiffByNumberOfGames = standing.pointsScoredByNumberOfGames - standing.pointsAgainstByNumberOfGames;

        await this.levelTeamStandingRepository.save(standing);
    }
}
