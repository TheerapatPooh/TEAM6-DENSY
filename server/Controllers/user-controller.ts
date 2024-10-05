import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'
import bcrypt from 'bcrypt'

export async function getUser(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.id, 10); 
        const user = await prisma.user.findUnique({
        where: { us_id: userId },
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
        const allUsers = await prisma.user.findMany({
            include: {
                profile:true
            }
        })
        if (allUsers) {
            res.send(allUsers)
        } else {
            res.status(404).send('All Users not found')
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const { username, email, password, role, department } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
          data: {
            us_username: username,
            us_email: email,
            us_password: hashPassword,
            us_role: role,
            us_department: department || null,
          },
        })

        await prisma.profile.create({
            data: {
              pf_us_id: newUser.us_id,
              pf_name: null,
              pf_age: null,
              pf_tel: null,
              pf_address: null
            }
          });
  
         res.status(201).json(newUser) 
    } catch (err) {
        res.status(500).send(err)
    }
}


export async function updateProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId
        const { name, age, tel, address } = req.body
        const imagePath = req.file?.filename || '';

        let image = null;
        if (imagePath) {
            image = await prisma.image.upsert({
                where: { im_pf_id: userId }, 
                update: {
                    im_path: imagePath, 
                },
                create: {
                    im_path: imagePath,  
                    profile: {
                        connect: { pf_us_id: userId } 
                    }
                }
            });
        }
        const updatedProfile = await prisma.profile.update({
            where: { pf_us_id: userId },
            data: {
                pf_name: name, 
                pf_age: age,
                pf_tel: tel,
                pf_address: address,
                pf_image: image ? { connect: { im_id: image.im_id } } : undefined
            },
        });

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
}



export async function getProfile(req: Request, res: Response) {
  try {
      const id = (req as any).user.userId
      const userWithProfile = await prisma.user.findUnique({
          where: { us_id:id }, 
          include: {
              profile: true
          },
      })

      if (!userWithProfile) {
          return res.status(404).json({ error: 'User or Profile not found' })
      }
      res.status(200).json(userWithProfile)
  } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to fetch user profile' })
  }
}