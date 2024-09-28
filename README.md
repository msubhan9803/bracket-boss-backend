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