# Base image
FROM node:20-alpine3.21 AS base

# ติดตั้ง dependencies
RUN apk add --no-cache python3 make g++ pkgconfig pixman-dev cairo-dev pango-dev 
RUN ln -sf python3 /usr/bin/python
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

# Set working directory
WORKDIR /app

# Client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Server
WORKDIR /app/server                       
COPY server/package*.json ./
RUN npm install
COPY server/ ./
COPY server/prisma ./prisma/
RUN npx prisma generate
RUN npm run build

# Final production stage
FROM node:20-alpine3.20 AS production
WORKDIR /app

# Install global dependencies
RUN npm install -g concurrently

# Copy built files from base stage
COPY --from=base /app/client /app/client
COPY --from=base /app/server /app/server

# Copy the entrypoint script
COPY entrypoint.sh /app/

# Set environment variables (optional)
ENV NODE_ENV=production
ENV CLIENT_PORT=3000
ENV SERVER_PORT=4000

# Expose ports for client and server
EXPOSE 3000 4000

# Command to handle migrations, seed data, and start client and server
CMD ["sh", "/app/entrypoint.sh"]