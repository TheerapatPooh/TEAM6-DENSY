import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'

export async function createDefect(req: Request, res: Response) {
    try {
         const { name, description, type, status, userId} = req.body;

        //  const newDefect = await prisma.defect.create({
        //      data: {
        //         df_name: name, 
        //         df_description: description, 
        //         df_type: type,
        //         df_status: status, 
        //         df_us_id: userId
        //      }
        //  });
        //  res.status(201).json(newDefect);
       
    } catch (err) {
        res.status(500).send(err)
    }
}