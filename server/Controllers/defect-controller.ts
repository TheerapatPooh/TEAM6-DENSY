import { de } from '@faker-js/faker/.';
import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'

export async function createDefect(req: Request, res: Response) {
    try {
         const { name, description, type, status, userId, patrolResultId } = req.body;

         const newDefect = await prisma.defect.create({
             data: {
                df_name: name, 
                df_description: description, 
                df_type: type,
                df_status: status, 
                user: { connect: { us_id: userId } },
                patrol_result: { connect: { pr_id: patrolResultId } } 
             }
         });
         res.status(201).json(newDefect);
       
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function getDefect(req: Request, res: Response) {
    try {
        const { id } = req.params; 

        const defect = await prisma.defect.findUnique({
            where: {
                df_id: Number(id), 
            },
        });
        res.status(200).json(defect);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function getAllDefect(req: Request, res: Response) {
    try {
        const defects = await prisma.defect.findMany();
        res.status(200).json(defects);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function updateDefect(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, description, type, status, userId, patrolResultId} = req.body;
        const defect = await prisma.defect.update({
            where: {
                df_id: Number(id),
            },
            data: {
                df_name: name,
                df_description: description,
                df_type: type,
                df_status: status,
                user: { connect: { us_id: userId } }, 
                patrol_result: { connect: { pr_id: patrolResultId } } 
            },
        });
        res.status(200).json(defect);
    } catch (err) {
        res.status(500).send(err);
    }
}   

export async function deleteDefect(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const defect = await prisma.defect.delete({
            where: {
                df_id: Number(id),
            },
        });
        res.status(200).json(defect);
    } catch (err) {
        res.status(500).send(err);
    }
}       
