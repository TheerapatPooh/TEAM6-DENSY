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
import csurf from "csurf";
import helmet from 'helmet';
import xss from 'xss';
import { ParsedQs } from 'qs';

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const PORT = process.env.SERVER_PORT

app.use(cookieParser());
app.use(corsMiddleware)

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "ws://localhost:4000", // อนุญาต WebSocket
          "http://localhost:3000" // อนุญาต HTTP
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(helmet.frameguard({ action: "deny" }));

// ฟังก์ชันสำหรับ sanitize ข้อมูล input
const sanitizeInput = (input: unknown): string | object | null => {
  if (typeof input === "string") {
    return xss(input);
  } else if (typeof input === "object" && input !== null) {
    return JSON.parse(xss(JSON.stringify(input)));
  }
  return input as null;
};

// Middleware เพื่อ sanitize request body, query, params
app.use((req, res, next) => {
  req.body = sanitizeInput(req.body);
  req.query = sanitizeInput(req.query) as ParsedQs;
  req.params = sanitizeInput(req.params) as Record<string, string>;
  next();
});

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

