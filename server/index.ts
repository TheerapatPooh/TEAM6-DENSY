import { readdirSync } from 'fs'
import bodyParse from 'body-parser'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import path from 'path'
import http from 'http';
import corsMiddleware from './Utils/cors'
import { initSocketIO } from './Utils/socket';

dotenv.config()


const app = express()
const PORT = process.env.SERVER_PORT
app.use(cookieParser());
app.use(corsMiddleware)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParse.json({ limit: '10mb' }))


readdirSync('./Routes').map((r: string) => app.use('/', require('./Routes/' + r)))


const server = http.createServer(app)

initSocketIO(server);

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


