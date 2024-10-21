FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY .env.server .env

RUN npx prisma generate

# RUN npx prisma db push

# RUN npx prisma db execute --file prisma\migrations\init\migration.sql

COPY . .

EXPOSE 4000

# CMD ["sh", "-c", "npm run seed && npm start"]
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db execute --file prisma/migrations/update.sql && npm run seed && npm start"]