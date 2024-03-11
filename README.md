# Backend Engineer Work Sample

A (mongodb) database URL must be present in .env to establish connection.

Swagger documentation is available at the route `/api-docs`.

Before running any scripts, run `nvm use` to set the correct node version.

## Scripts 
* `npm run start` starts the server
* `npm run dev` starts the server in development mode with nodemon, which detects and applies changes automatically
* `npm run test` executes the tests
* `npm run test:coverage` executes the tests along with a coverage report

## Goal
1. Adjust POST /users that it accepts a user and stores it in a database.
    * The user should have a unique id, a name, a unique email address and a creation date
2. Adjust GET /users that it returns (all) users from the database.
   * This endpoint should be able to receive a query parameter `created` which sorts users by creation date ascending or descending.


