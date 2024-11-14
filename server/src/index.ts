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

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const PORT = process.env.SERVER_PORT

app.use(cookieParser());
app.use(corsMiddleware)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParse.json({ limit: '10mb' }))


readdirSync(path.join(__dirname, 'Routes')).map(async (file) => {
    const route = await import(`./Routes/${file}`);
    app.use('/api', route.default || route);
  });

const server = http.createServer(app)

initSocketIO(server);

server.listen(PORT || 4000, () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

