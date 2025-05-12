import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelTeamStanding } from '../entities/level-team-standing.entity';
import { FindOptionsOrder, Repository } from 'typeorm';

@Injectable()
export class LevelTeamStandingService {
    private readonly commonLevelTeamStandingRelationships = [
        'level',
        'team',
        'team.users',
    ];

    constructor(
        @InjectRepository(LevelTeamStanding)
        private readonly levelTeamStandingRepository: Repository<LevelTeamStanding>,
    ) { }

    findAllByLevelId(params: {
        levelId: number;
        relations?: string[];
        order?: FindOptionsOrder<LevelTeamStanding>;
    }): Promise<LevelTeamStanding[]> {
        return this.levelTeamStandingRepository.find({
            where: { level: { id: params.levelId } },
            order: params.order,
            relations: params.relations ?? this.commonLevelTeamStandingRelationships
        });
    }

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

        standing.pointsScoredByNumberOfGames = Number((updates.pointsScored / numberOfRounds).toFixed(2));
        standing.pointsAgainstByNumberOfGames = Number((updates.pointsAgainst / numberOfRounds).toFixed(2));
        standing.pointDiffByNumberOfGames = Number((standing.pointsScoredByNumberOfGames - standing.pointsAgainstByNumberOfGames).toFixed(2));

        try {
            await this.levelTeamStandingRepository.save(standing);
        } catch (error) {
            console.log('Error: ', error)
            throw new InternalServerErrorException('Error: ', error.message);
        }
    }
}
