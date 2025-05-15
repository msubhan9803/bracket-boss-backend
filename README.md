# Bracket Boss Backend app built using Nest Js

## ✅ Initial setup
```bash
# Install dependencies
$ pnpm install

# Copy dev env template file to .env.development (required during development)
$ cp .env.template .env.development

# Run required services using docker-compose i.e. postgres
$ docker-compose up -d

# Run migrations (refer to Migrations section)
```
**IMPORTANT NOTE: If you have a separate copy of Postgres installed, you must stop that Postgres instance or it will claim the port that the Docker tries to use, and you will not be able to connect to Postgres.**

## Migrations
```bash
# Run all migrations
$ npm run typeorm:run-migrations:dev

# Create new migration by providing the name of the migration
$ npm run typeorm:create-migration --name=SetRoles

# Revert all migrations
$ npm run typeorm:revert-migrations:dev
```



## DB Setup
```bash
# Dump
$ PGPASSWORD="Password123" pg_dump -U dbuser -h localhost -d bracket_boss > bracket_boss_backup.sql

# Restore
$ PGPASSWORD="Password123" psql -U dbuser -h localhost -d bracket_boss -f bracket_boss_backup.sql

# Public Schema permissions
$ GRANT ALL ON SCHEMA public TO dbuser;
```


## Deployment
```bash
# Build
$ pnpm run build

# Stop & Delete Pm2 process
$ pm2 stop 0 && pm2 delete 0

# Start app with Pm2 process
$ pm2 start npm --name "bracket-boss-backend-app" -- run start:prod
```




# Connect to bracket boss db
psql -h bracket-boss.c1i4kgo2c1pu.us-west-1.rds.amazonaws.com -p 5432 -U bb_db_user -d bracket_boss_db



# Connect to temp db
psql -h bracket-boss.c1i4kgo2c1pu.us-west-1.rds.amazonaws.com -p 5432 -U bb_db_user -d temp_db



SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'bracket_boss_db';


DROP DATABASE bracket_boss_db;
CREATE DATABASE bracket_boss_db;

\connect bracket_boss_db


psql -h bracket-boss.c1i4kgo2c1pu.us-west-1.rds.amazonaws.com -U bb_db_user -d bracket_boss_db -f  /Users/hamari_m1/local-backup-15-may-2025.sql