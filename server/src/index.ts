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

// โหลด .env และกำหนดค่าพอร์ตจาก .env
dotenv.config()

// กำหนดค่า path สำหรับไฟล์
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

// สร้างแอพ Express
const app = express()
const PORT = process.env.SERVER_PORT

// ใช้ cookie-parser เพื่อจัดการกับ cookies
app.use(cookieParser());

// ใช้ middleware สำหรับ CORS
app.use(corsMiddleware)

// กำหนดค่า csrfProtection เพื่อป้องกันการโจมตี CSRF
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);
// Route สำหรับดึง token สำหรับ CSRF
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ใช้ helmet เพื่อเพิ่มความปลอดภัยของ HTTP headers
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
          process.env.CLIENT_URL || 'http://localhost:3000'
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ป้องกันการโหลด iframe โดยการปิด frameguard
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

// ให้บริการไฟล์ที่อยู่ในโฟลเดอร์ uploads
app.use('/uploads', express.static(path.join(dirName, '../../server/uploads')));

// กำหนด body parser ให้รองรับขนาดไฟล์สูงสุดที่ 10MB
app.use(bodyParse.json({ limit: '10mb' }))
app.use(express.json())

// ดึงไฟล์ทั้งหมดจากโฟลเดอร์ Routes และนำมาจัดการใน Express
readdirSync(path.join(dirName, 'Routes')).map(async (file) => {
  const route = await import(`./Routes/${file}`);
  app.use('/api', route.default || route);
});

// กำหนดค่าของ Swagger UI สำหรับเอกสาร API
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
// ใช้ swagger-ui เพื่อแสดงเอกสาร API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// สร้าง HTTP server และเริ่มต้นการเชื่อมต่อ Socket.IO
const server = http.createServer(app)
initSocketIO(server);

// เริ่มต้น server และให้บริการที่พอร์ตที่กำหนด
server.listen(PORT || 4000, () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

