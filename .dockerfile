# Base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app


# Client
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install
RUN mkdir -p ./public
COPY client ./
RUN npm run build

# Server
WORKDIR /app                       
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install
COPY server ./
COPY server/prisma ./prisma/
RUN npx prisma generate
RUN npm run build

# Final production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install global dependencies
RUN npm install -g concurrently

# Copy node_modules and built files from base stage
COPY --from=base /app/client/.next ./client/.next
COPY --from=base /app/client/public ./client/public
COPY --from=base /app/client/node_modules ./client/node_modules
COPY --from=base /app/client/package.json ./client/ 

COPY --from=base /app/server/dist ./server/dist
COPY --from=base /app/server/node_modules ./server/node_modules
COPY --from=base /app/server/prisma ./server/prisma
COPY --from=base /app/server/package.json ./server/ 


# Set environment variables (optional)
ENV NODE_ENV=production
ENV CLIENT_PORT=3000
ENV SERVER_PORT=4000

# Expose ports for client and server
EXPOSE 3000 4000

# Command to handle migrations, seed data, and start client and server
CMD ["sh", "-c", "cd server && npx prisma migrate deploy && npx prisma db execute --file prisma/migrations/update.sql && node dist/index.js concurrently npm start --prefix ../client"]
