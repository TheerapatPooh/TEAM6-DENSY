import { readdirSync } from 'fs'
import bodyParse from 'body-parser'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 4000

app.use(cors())

app.use(bodyParse.json({limit: '10mb'}))

readdirSync('./Routes').map((r:string) => app.use('/',require('./Routes/' + r)))

app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`)
})