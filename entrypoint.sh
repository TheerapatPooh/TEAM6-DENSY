#!/bin/sh
cd server
npx prisma migrate deploy
npm run seed
node dist/index.js &
cd ../client
npm start
