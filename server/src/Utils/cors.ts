import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); 

const corsMiddleware = cors({
    origin: process.env.CLIENT_URL,  
    credentials: true,
    exposedHeaders: ['Content-Length', 'Authorization'], 
});

export default corsMiddleware;
