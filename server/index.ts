import { readdirSync } from 'fs'
import bodyParse from 'body-parser'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import path from 'path'
import axios from 'axios';

dotenv.config()


const app = express()
const PORT = 4000
app.use(cookieParser());
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true
}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(bodyParse.json({limit: '10mb'}))

readdirSync('./Routes').map((r:string) => app.use('/',require('./Routes/' + r)))

app.listen(PORT, ()=> {
    console.log(`Server is running at http://localhost:${PORT}`)
})



async function updatePatrolStatus(patrolId: number) {
    try {
        await axios.put(`http://localhost:4000/patrol/${patrolId}/status`, {
            patrolId:patrolId,
            status: "scheduled"
        });
        console.log(`Patrol ${patrolId} status updated to "on_going".`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error updating patrol ${patrolId}:`, error.response?.data || error.message);
        } else {
            console.error(`Unknown error updating patrol ${patrolId}:`, error);
        }
    }
}

async function checkAndUpdatePendingPatrols() {
    try {
        const response = await axios.get('http://localhost:4000/patrols/pending');
        const patrols = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const patrol of patrols) {
            const patrolDate = new Date(patrol.date);
            patrolDate.setHours(0, 0, 0, 0); 

            if (patrolDate.getTime() === today.getTime()) {
                await updatePatrolStatus(patrol.id);
            }
        }

        console.log("Checked and updated pending patrols for today.");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching patrol:", error.response?.data || error.message);
        } else {
            console.error("Unknown error fetching or updating patrols:", error);
        }
    }
}

function schedulePatrolStatusUpdate() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

    setTimeout(() => {
        checkAndUpdatePendingPatrols();
        setInterval(checkAndUpdatePendingPatrols, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
}


schedulePatrolStatusUpdate();
