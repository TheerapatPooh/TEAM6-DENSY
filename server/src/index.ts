import { readdirSync } from 'fs'
import bodyParse from 'body-parser'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import path from 'path'
import http from 'http';
import corsMiddleware from '@Utils/cors.js'
import { initSocketIO } from '@Utils/socket.js';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const PORT = process.env.SERVER_PORT

app.use(cookieParser());
app.use(corsMiddleware)
app.use('/uploads', express.static(path.join(__dirname, '../../server/uploads')));
app.use(bodyParse.json({ limit: '10mb' }))
app.use(express.json())

readdirSync(path.join(__dirname, 'Routes')).map(async (file) => {
  const route = await import(`./Routes/${file}`);
  app.use('/api', route.default || route);
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation for the API',
    },

    servers: [
      {
        url: `http://localhost:${PORT}`,
      }
    ],
  },
  apis: ['./src/Routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = http.createServer(app)

initSocketIO(server);

server.listen(PORT || 4000, () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

