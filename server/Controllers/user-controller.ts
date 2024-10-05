import { prisma } from '../Utils/database'
import { Request, response, Response } from 'express'
import bcrypt from 'bcrypt'
import { Profile, User } from '../Utils/type';
import { faker, tr } from '@faker-js/faker';
import fs from 'fs';
import path from 'path'


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
                id: user.us_id,
                username: user.us_username,
                email: user.us_email,
                password: user.us_password,
                role: user.us_role,
                department: user.us_department,
                createdAt: user.us_created_at.toISOString(),
                profile: user.profile.map((profile: any): Profile => ({
                    id: profile.pf_id,
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
        const role = (req as any).user.role
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
                id: user.us_id,
                username: user.us_username,
                email: user.us_email,
                password: user.us_password,
                role: user.us_role,
                department: user.us_department,
                createdAt: user.us_created_at,
                profile: user.profile.map((profile: any): Profile => ({
                    id: profile.pf_id,
                    name: profile.pf_name,
                    age: profile.pf_age,
                    tel: profile.pf_tel,
                    address: profile.pf_address,
                    userId: profile.pf_us_id,
                })),
            }))
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

        const userRole = (req as any).user.role
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ message: "Access Denied: Admins only" })
        }
        const { email, password, role, department }: User = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        const latestUser = await prisma.user.findFirst({
            orderBy: {
                us_id: 'desc',
            },
        });

        const nextId = (latestUser?.us_id ?? 0) + 1

        const randomWord = faker.word.noun()
        const username = `${randomWord}${nextId}`;

        const newUser = await prisma.user.create({
            data: {
                us_username: username,
                us_email: email ?? "",
                us_password: hashPassword,
                us_role: role ?? "INSPECTOR",
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
        const result = {
            id: newUser.us_id,
            username: newUser.us_username,
            email: newUser.us_email,
            role: newUser.us_role,
            department: newUser.us_department,
            createdAt: newUser.us_created_at.toISOString(),
        };

        res.status(201).json(result);
    } catch (err) {
        res.status(500).send(err)
    }
}


export async function updateProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId
        const { name, age, tel, address } = req.body
        const imagePath = req.file?.filename || '';
        const user = await prisma.user.findUnique({
            where: { us_id: userId },
            include: {
                profile: {
                    include: {
                        pf_image: true
                    }
                }
            }
        })

        if (!user) {
            return res.status(404);
        }

        if (imagePath && user.profile[0].pf_image) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', user.profile[0].pf_image.im_path);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        let image = null;
        if (imagePath) {
            image = await prisma.image.upsert({
                where: { im_pf_id: user.profile[0].pf_id },
                update: {
                    im_path: imagePath,
                },
                create: {
                    im_path: imagePath,
                    profile: {
                        connect: { pf_id: user.profile[0].pf_id }
                    }
                }
            });
        }

        const updatedProfile = await prisma.profile.update({
            where: { pf_us_id: userId },
            data: {
                pf_name: name,
                pf_age: parseInt(age, 10),
                pf_tel: tel,
                pf_address: address,
                pf_image: image ? { connect: { im_id: image.im_id } } : undefined
            },
        });

        const result = {
            id: updatedProfile.pf_id,
            name: updatedProfile.pf_name,
            age: updatedProfile.pf_age,
            tel: updatedProfile.pf_tel,
            address: updatedProfile.pf_address,
            userId: updatedProfile.pf_us_id,
            imagePath: image ? image.im_path : null
        };

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
}


export async function getProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId
        const id = parseInt(req.params.id, 10);
        let userWithProfile = null
        if (!id) {
            userWithProfile = await prisma.user.findUnique({
                where: { us_id: userId },
                include: {
                    profile: true,
                },
            });
        }
        else {
            userWithProfile = await prisma.user.findUnique({
                where: { us_id: id },
                include: {
                    profile: true,
                },
            })
        }

        if (!userWithProfile) {
            return res.status(404)
        }

        const result: Omit<User, 'password'> = {
            id: userWithProfile.us_id,
            username: userWithProfile.us_username,
            email: userWithProfile.us_email,
            role: userWithProfile.us_role,
            department: userWithProfile.us_department,
            createdAt: userWithProfile.us_created_at.toISOString(),
            profile: userWithProfile.profile.map((profile: any) => ({
                id: profile.pf_id,
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

export async function getAllProfile(req: Request, res: Response) {
    try {
        const allProfiles = await prisma.user.findMany({
            include: {
                profile: {
                    include: {
                        pf_image: true
                    }
                },
            },
        });

        if (allProfiles) {
            const result: User[] = allProfiles.map((user: any) => ({
                id: user.us_id,
                username: user.us_username,
                email: user.us_email,
                role: user.us_role,
                department: user.us_department,
                profile: user.profile.map((profile: any): Profile => ({
                    id: profile.pf_id,
                    name: profile.pf_name,
                    age: profile.pf_age,
                    tel: profile.pf_tel,
                    address: profile.pf_address,
                    userId: profile.pf_us_id,
                })),
            }));
            res.status(200).json(result);
        } else {
            response.status(404)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
}
