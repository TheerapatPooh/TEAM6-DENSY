#!/bin/sh
cd /app/server
npx prisma migrate deploy
npm run seed
node dist/index.js &
cd /app/client
npm start
