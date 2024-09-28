import { readdirSync } from 'fs'
import bodyParse from 'body-parser'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

dotenv.config()


const app = express()
const PORT = 4000
app.use(cookieParser());
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true
}))

app.use(bodyParse.json({limit: '10mb'}))

readdirSync('./Routes').map((r:string) => app.use('/',require('./Routes/' + r)))

app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`)
})