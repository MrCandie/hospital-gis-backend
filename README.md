## REPO URL

https://github.com/MrCandie/hospital-gis-backend

## DEPLOYED URL

https://hospital-gis-backend.onrender.com

## API DOCUMENTATION

https://documenter.getpostman.com/view/27220467/2sBXVhDWfZ

## TECH STACKS

- Express.js
- PostgreSQL for database
- Redis for caching & data persistence
- Sequelize (ORM for interacting with PostgreSQL)

## RUNNING THE PROJECT

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install

   ```

3. Set up PostgreSQL:

- Paste the Docker configuration content (shared via email) into docker-compose.yml
- Run Docker to start PostgreSQL

4. Create .env file and paste the environment variables (shared via email)

5. Start the server:
   ```bash
   npm run dev
   ```
