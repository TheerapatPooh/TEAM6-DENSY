import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'

export async function createDefect(req: Request, res: Response) {
    try {
         const { title, note, type, status, users_id} = req.body;

         const newDefect = await prisma.defect.create({
             data: {
                title, 
                note, 
                type,
                status, 
                users_id
             }
         });
         res.status(201).json(newDefect);
       
    } catch (err) {
        res.status(500).send(err)
    }
}

