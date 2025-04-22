import { Injectable } from '@nestjs/common';
import { CellValue, Workbook, Worksheet } from 'exceljs';
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import path from 'path';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ScheduleSpreadsheetHandlerService {
    private readonly uploadDir = path.resolve('uploads');

    constructor() { }

    async generateUserDataForScheduleTemplate(users: User[]): Promise<string> {
        const backgroundColor = '9cccff';
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Users');

        const headers = ['Name', 'User Id', 'Email'];
        const headerRow = worksheet.addRow(headers);

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: backgroundColor },
            };
        });

        users.forEach(user => {
            worksheet.addRow([user.name, user.id, user.email]);
        });

        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength + 2;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const base64String = (buffer as Buffer).toString("base64");

        return base64String;
    }

    async generateEmptyScheduleTemplate(clubId: number, tournamentId: number): Promise<string> {
        const backgroundColor = '9cccff';
        const disabledBackgroundColor = 'b5b5b5';

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Users');

        /**
         * Club & Tournament Ids
         */
        const clubTournamentIdHeader = ['Club Id', 'Tournament Id'];
        const headerRow = worksheet.addRow(clubTournamentIdHeader);

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: backgroundColor },
            };
        });

        const clubTournamentIdData = worksheet.addRow([clubId, tournamentId]);
        clubTournamentIdData.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: disabledBackgroundColor },
            };
        });

        this.addEmptyRow(worksheet);

        /**
         * Match Heading
         */
        const matchHeadingRow = worksheet.addRow(['Matches']);
        matchHeadingRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: backgroundColor },
            };
        });

        /**
         * Match Heading
         */
        const matchHeaders = ['Match Date', 'Title', 'Team 1 Name', 'Team 1 User 1', 'Team 1 User 2', 'Team 2 Name', 'Team 2 User 1', 'Team 2 User 2'];
        const matchHeadersRow = worksheet.addRow(matchHeaders);
        matchHeadersRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: backgroundColor },
            };
        });

        /**
         * Set column width based on the maximum length of the cell value
         */
        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength + 2;
        });

        /**
         * Convert workbook to base64 string
         */
        const buffer = await workbook.xlsx.writeBuffer();
        const base64String = (buffer as Buffer).toString("base64");

        return base64String;
    }

    async parseMatchScheduleFromTemplate(file: FileUpload): Promise<{
        tournamentId: any;
        matches: {
            matchDate: any;
            title: string;
            teams: {
                name: any;
                userIds: any[];
            }[];
        }[];
    }> {
        const { createReadStream, filename } = file;
        const filePath = path.join(this.uploadDir, filename);

        await new Promise((resolve, reject) => {
            const stream = createReadStream().pipe(createWriteStream(filePath));
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet(1);
        const rows = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            rows.push((row.values as CellValue[]).filter(val => val !== null));
        });

        const matches = rows.slice(5).map(row => {
            const team1 = {
                name: row[2],
                userIds: [
                    row[3],
                    row[4]
                ]
            };
            const team2 = {
                name: row[5],
                userIds: [
                    row[6],
                    row[7]
                ]
            };

            return {
                matchDate: row[0],
                title: row[1],
                teams: [team1, team2]
            }
        })

        const scheduleData = {
            tournamentId: rows[1][1],
            matches
        }

        return scheduleData;
    }

    /**
     * Helper methods
     */
    async addEmptyRow(worksheet: Worksheet) {
        worksheet.addRow(['']);
    }
}
