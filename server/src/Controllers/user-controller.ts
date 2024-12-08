import { prisma } from '@Utils/database.js'
import { Request, response, Response } from 'express'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'

export async function createUser(req: Request, res: Response) {
    try {
        const userRole = (req as any).user.role
        if (userRole !== 'admin') {
            res.status(403).json({ message: "Access Denied: Admins only" })
            return
        }
        let { username, email, password, role, department } = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        const latestUser = await prisma.user.findFirst({
            orderBy: {
                id: 'desc',
            },
        })

        const nextId = (latestUser?.id ?? 0) + 1
        if (!username) {
            const randomWord = faker.word.noun()
            username = `${randomWord}${nextId}`
        }

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email ?? null,
                password: hashPassword,
                role: role ?? "inspector",
                department: department || null,
            },
        })

        await prisma.profile.create({
            data: {
                userId: newUser.id,
                name: null,
                age: null,
                tel: null,
                address: null
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                id: newUser.id
            },
            include: {
                profile: {
                    include: {
                        image: true
                    }
                }
            }
        })

        let result = user
        res.status(201).json(result)
        return
    } catch (error) {
        res.status(500).send(error)
        return
    }
}


export async function updateProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;
        const { name, age, tel, address } = req.body;
        const imagePath = req.file?.filename || '';

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: {
                    include: {
                        image: true,
                    },
                },
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return
        }

        if (imagePath && user.profile?.image) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', user.profile.image.path);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        let image = null;
        if (imagePath) {
            image = await prisma.image.upsert({
                where: { id: user.profile?.image?.id || 0 },
                update: {
                    path: imagePath,
                    profiles: {
                        connect: { id: user.profile?.id },
                    },
                },
                create: {
                    path: imagePath,
                    updatedBy: userId,
                    profiles: {
                        connect: { id: user.profile?.id },
                    },
                },
            });
        }

        // Update profile data
        const updatedProfile = await prisma.profile.update({
            where: { userId: userId },
            data: {
                name: name,
                age: parseInt(age, 10),
                tel: tel,
                address: address,
                imageId: image?.id, // Connect image if it exists
            },
        });

        // Prepare result response
        let result = updatedProfile
        res.status(200).json(result);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user profile' }); // Improved error handling
        return
    }
}


export async function getUser(req: Request, res: Response) {
    try {
        const includeProfile = req.query.profile === "true";
        const includeImage = req.query.image === "true";
        const includePassword = req.query.password === "true";

        const userId = (req as any).user.userId
        const id = parseInt(req.params.id, 10)
        let user = null
        if (!id) {
            user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    password: includePassword ? true : false,
                    role: true,
                    createdAt: true,
                    profile: includeProfile
                        ? {
                            include: {
                                image: includeImage
                            }
                        } : undefined,
                },
            })
        }
        else {
            user = await prisma.user.findUnique({
                where: { id: id },
                include: {
                    profile: includeProfile
                        ? {
                            include: {
                                image: includeImage
                            }
                        } : undefined,
                },
            })
        }

        if (!user) {
            res.status(404)
            return
        }

        let result = user
        res.status(200).json(result)
        return
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch user profile' })
        return
    }
}

export async function getAllUser(req: Request, res: Response) {
    try {
        const includeProfile = req.query.profile === "true";
        const includeImage = req.query.image === "true";

        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                profile: includeProfile
                    ? {
                        include: {
                            image: includeImage
                        }
                    } : undefined,
            },
        })

        if (allUsers) {
            let result = allUsers
            res.status(200).json(result)
            return
        } else {
            response.status(404)
            return
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch user profile' })
        return
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const loggedInUserId = (req as any).user.userId;
        const loggedInUserRole = (req as any).user.role;
        const id = parseInt(req.params.id, 10);
        const { username, email, password, role, department } = req.body;

        // ตรวจสอบว่าผู้ใช้ที่ล็อกอินอยู่เป็นเจ้าของบัญชีที่กำลังถูกอัปเดต หรือเป็น admin
        if (loggedInUserId !== id && loggedInUserRole !== 'admin') {
            res.status(403).json({ message: "Access Denied: You must be the owner of this account or an admin" });
            return
        }

        const updateData: any = {
            us_email: email,
            us_password: password ? await bcrypt.hash(password, 10) : undefined,
            us_department: department,
        };

        // เฉพาะ admin เท่านั้นที่สามารถเปลี่ยน username และ role ได้
        if (loggedInUserRole === 'admin') {
            updateData.us_username = username;
            updateData.us_role = role;
        }

        // อัปเดตข้อมูลผู้ใช้
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: updateData,
        });

        const result = {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
            createdAt: updatedUser.createdAt.toISOString(),
        };

        res.status(200).json(result);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
        return
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const role = (req as any).user.role;

        if (role !== 'admin') {
            res.status(403).json({ message: "Access Denied: Admin only" });
            return
        }

        const user = await prisma.user.findUnique({
            where: { id: id },
            include: { profile: true, zones: true },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // ตรวจสอบว่ามี Zone ที่เชื่อมโยงอยู่หรือไม่
        if (user.zones) {
            // ลบข้อมูลที่เชื่อมโยงกับ PatrolResult
            const patrolResults = await prisma.patrolResult.findMany({
                where: { zoneId: user.zones.id },
            });

            for (const patrolResult of patrolResults) {
                // ลบ Comment ที่อ้างถึง PatrolResult นี้
                await prisma.comment.deleteMany({
                    where: { patrolResultId: patrolResult.id },
                });

                // ลบ Defect ที่อ้างถึง PatrolResult นี้
                await prisma.defect.deleteMany({
                    where: { patrolResultId: patrolResult.id },
                });
            }

            // ลบข้อมูลใน PatrolResult ที่อ้างถึง Zone
            await prisma.patrolResult.deleteMany({
                where: { zoneId: user.zones.id },
            });

            // ลบ Zone หลังจากจัดการข้อมูลที่เชื่อมโยงเสร็จ
            await prisma.zone.delete({
                where: { userId: id },
            });
        }

        // ลบ Profile ถ้ามี
        if (user.profile) {
            await prisma.profile.delete({
                where: { userId: id },
            });
        }

        // ลบ User หลังจากจัดการ Zone และ Profile
        await prisma.user.delete({
            where: { id: id },
        });

        res.status(200).json({ message: 'User deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
        return
    }
}