# Shangrila Petition Web App

- There are two folders named frontend and backend.

## Backend setup

- `cd` to `backend`.
- Run `npm install` which installs all the necessary packages and dependencies from `package.json`.
- Run the `mgm22.sql` file on mysql workbench to create database and tables.
- Change the db credentials in `server.js` as follows:
  ![alt text](credentials.png)
- Run the application using `npm run dev` command.

## Frontend setup

- `cd` to `frontend`.
- Run `npm install` which installs all the necessary packages and dependencies from `package.json`.
- Run the application using `npm run dev` command.

## Authentication

- Both users and admin can login through the common `Login` UI card.
- When logged in through admin credentials, it will redirect it to Admin Dashboard.
- When logged in through user credentials, it will redirect it to User Dashboard.
