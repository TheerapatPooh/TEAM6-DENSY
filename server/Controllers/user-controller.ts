import { prisma } from '../Utils/database'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { Profile, User } from '../Utils/type';


export async function getUser(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        const Id = parseInt(req.params.id, 10)
        const user = await prisma.user.findUnique({
            where: { us_id: Id },
            include: {
                profile: true
            }
        });

        if (role !== 'ADMIN') {
            return res.status(403).json({ message: "Access Denied: Admins only" })
        }
        if (user) {
            const result: User = {
                userId: user.us_id,
                username: user.us_username,
                email: user.us_email,
                password: user.us_password,
                role: user.us_role,
                department: user.us_department,
                createdAt: user.us_created_at.toISOString(),
                profile: user.profile.map((profile: any): Profile => ({
                    profileId: profile.pf_id,
                    name: profile.pf_name,
                    age: profile.pf_age,
                    tel: profile.pf_tel,
                    address: profile.pf_address,
                    userId: profile.pf_us_id,
                })),


            }
            res.status(200).json(result)
        } else {
            return res.status(404)

        }
    } catch (error) {
        res.status(500)
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const role = (req as any).user
        const allUsers = await prisma.user.findMany({
            include: {
                profile: true
            }
        })

        if (role !== 'ADMIN') {
            return res.status(403).json({ message: "Access Denied: Admins only" })
        }

        if (allUsers) {
            const result: User[] = allUsers.map((user: any) => ({
                userId: user.us_id,
                username: user.us_username,
                email: user.us_email,
                password: user.us_password,
                role: user.us_role,
                department: user.us_department,
                createdAt: user.us_created_at,
                profile: user.profile.map((profile: any): Profile => ({
                    profileId: profile.pf_id,
                    name: profile.pf_name,
                    age: profile.pf_age,
                    tel: profile.pf_tel,
                    address: profile.pf_address,
                    userId: profile.pf_us_id,
                })),
            }));
            console.log(role)
            res.status(200).send(result)
        } else {
            res.status(404)
        }
    } catch (err) {
        res.status(500)
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
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function getProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;

        const userWithProfile = await prisma.user.findUnique({
            where: { us_id: userId },
            include: {
                profile: true,
            },
        });

        if (!userWithProfile) {
            return res.status(404).json({ error: 'User or Profile not found' });
        }

        const result: User = {
            userId: userWithProfile.us_id,
            username: userWithProfile.us_username,
            email: userWithProfile.us_email,
            password: userWithProfile.us_password,
            role: userWithProfile.us_role,
            department: userWithProfile.us_department,
            createdAt: userWithProfile.us_created_at.toISOString(),
            profile: userWithProfile.profile.map((profile: any) => ({
                profileId: profile.pf_id,
                name: profile.pf_name,
                age: profile.pf_age,
                tel: profile.pf_tel,
                address: profile.pf_address,
                userId: profile.pf_us_id,
            })),
        };

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
}
