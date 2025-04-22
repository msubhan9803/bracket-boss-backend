import dataSource from 'typeOrm.config';
import { AddPickleballSportSeeder } from 'seeders/scripts/AddPickleballSportSeeder';
import { OnboardingStepsSeeder } from 'seeders/scripts/OnboardingStepsSeeder';
import { RoleSeeder } from 'seeders/scripts/RoleSeeder';
import { SuperAdminSeeder } from 'seeders/scripts/SuperAdminSeeder';
import { UserManagementSeeder } from 'seeders/scripts/UserManagementSeeder';
import { AddFormatsAndTeamGenerationTypesSeeder } from './scripts/AddFormatsAndTeamGenerationTypesSeeder';
import { AddMatchStatusSeeder } from './scripts/AddMatchStatusSeeder';
import { AddMatchRoundStatusSeeder } from './scripts/AddMatchRoundStatusSeeder';
import { AddTeamStatusSeeder } from './scripts/AddTeamStatusSeeder';
import { AddDaysSeeder } from './scripts/AddDaysSeeder';
import { AddTimeSlotsSeeder } from './scripts/AddTimeSlotsSeeder';

async function runSeeder() {
  await dataSource
    .initialize()
    .then(() => console.log('Connection established'))
    .catch((err) => console.error('Error connecting to database:', err));

  await RoleSeeder.seed(dataSource);
  await SuperAdminSeeder.seed(dataSource);
  await UserManagementSeeder.seed(dataSource);
  await OnboardingStepsSeeder.seed(dataSource);
  await AddPickleballSportSeeder.seed(dataSource);
  await AddFormatsAndTeamGenerationTypesSeeder.seed(dataSource);
  await AddMatchStatusSeeder.seed(dataSource);
  await AddMatchRoundStatusSeeder.seed(dataSource);
  await AddTeamStatusSeeder.seed(dataSource);
  await AddDaysSeeder.seed(dataSource);
  await AddTimeSlotsSeeder.seed(dataSource);

  await dataSource.destroy();
}

runSeeder().catch((error) => {
  console.error('Error running seeder:', error);
  process.exit(1);
});
