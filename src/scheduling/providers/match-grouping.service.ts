import { Injectable } from '@nestjs/common';
import { MatchInput } from '../dtos/create-schedule-input.dto';
import { GroupedMatches } from '../types/common';

@Injectable()
export class MatchGroupingService {
    constructor() { }

    /**
     * Groups matches by uniqueness, ensuring that no user is playing in more than one match within the same group.
     * 
     * @param {MatchInput[]} matches - An array of match inputs to be grouped.
     * @returns {Object} An object where each key represents a group and contains an array of matches.
     * 
     * The method iterates over each match and checks if any user from the current match is already playing in the existing groups.
     * If no user from the current match is found in the existing groups, the match is added to the current group.
     * If a user from the current match is found in the existing groups, a new group is created and the match is added to this new group.
     */
    groupMatchesByUniqueness(matches: MatchInput[]): GroupedMatches {
        let groupedMatches: { [key: string]: { matches: MatchInput[] } } = {
            group1: {
                matches: [],
            },
        };

        for (let index = 0; index < matches.length; index++) {
            const currentMatch = matches[index];
            const userIds = this.getMatchUserIds(currentMatch);

            for (let groupIndex = 0; groupIndex < Object.keys(groupedMatches).length; groupIndex++) {
                const groupKey = Object.keys(groupedMatches)[groupIndex];
                const groupMatches = groupedMatches[groupKey].matches;

                /**
                 * Check if any user from current match exists in group matches
                 */
                const doesAnyCurrentUserAlreadyPlaying = groupMatches.some(groupMatch =>
                    userIds.some(userId => this.getMatchUserIds(groupMatch).includes(userId))
                );

                if (!doesAnyCurrentUserAlreadyPlaying) {
                    // Adding to current group
                    groupedMatches[groupKey] = {
                        matches: [
                            ...groupedMatches[groupKey].matches,
                            currentMatch,
                        ],
                    };
                    break;
                } else if (Object.keys(groupedMatches).length === groupIndex + 1) {
                    // Adding to new group
                    groupedMatches[`group${Object.keys(groupedMatches).length + 1}`] = {
                        matches: [currentMatch],
                    };
                    break;
                }
            }
        }

        Object.keys(groupedMatches).forEach(groupKey => {
            groupedMatches[groupKey].matches.sort((a, b) => 
                new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
            );
        });

        this.logGroupedMatches(groupedMatches);

        return groupedMatches;
    }

    /**
     * Logs grouped matches to the console in a structured format.
     * @param {Object} groupedMatches - The grouped matches object.
     */
    logGroupedMatches(groupedMatches: { [key: string]: { matches: MatchInput[] } }): void {
        Object.keys(groupedMatches).forEach((groupName) => {
            console.log(' ');
            console.log(`Group: ${groupName}`);

            const group = groupedMatches[groupName];

            // For each match in this group
            group.matches.forEach((match) => {
                console.log(match.teams.map(team => team.name).join(' vs '));
            });

            console.log(' ');
        });
    }

    /**
     * Extracts all user IDs from a match input.
     * @param {MatchInput} match - A match input.
     * @returns {number[]} Array of user IDs in the match.
     */
    private getMatchUserIds(match: MatchInput): number[] {
        return match.teams.map(team => team.userIds).flat();
    }
}
