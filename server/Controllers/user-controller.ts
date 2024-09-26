import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'

export async function getUser(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); 
        const user = await prisma.users.findUnique({
        where: { id },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const allUsers = await prisma.users.findMany()
        if (allUsers) {
            res.send(allUsers)
        } else {
            res.status(404).send('All Users not found')
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function createUsers(req: Request, res: Response) {
    try {
         const { username, email, password, role, department } = req.body;

         const newUser = await prisma.users.create({
             data: {
                username, 
                email, 
                password, 
                role, 
                department: department || null,
             }
         });
         res.status(201).json(newUser);
       
    } catch (err) {
        res.status(500).send(err)
    }
}
