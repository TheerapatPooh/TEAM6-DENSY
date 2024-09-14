const { readdirSync } = require('fs')

const bodyParse = require('body-parser')
const express = require('express')
const app = express()
const PORT = 5000
const cors = require('cors')

app.use(cors())

app.use(bodyParse.json({limit: '10mb'}))
readdirSync('./Routes').map((r:string) => app.use('/',require('./Routes/' + r)))

app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`)
})