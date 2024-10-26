import { prisma } from '../Utils/database'
import { Request, response, Response } from 'express'
import bcrypt from 'bcrypt'
import { Profile, User } from '../Utils/type'
import { faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'


export async function getUser(req: Request, res: Response) {
    try {
        const role = (req as any).user.role;
        const Id = parseInt(req.params.id, 10);
        const user = await prisma.user.findUnique({
            where: { us_id: Id },
        });

        if (role !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Admins only" });
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
            };

            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const role = (req as any).user.role
        if (role !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Admins only" })
        }
        const allUsers = await prisma.user.findMany()

        if (allUsers) {
            const result: User[] = allUsers.map((user: any) => ({
                id: user.us_id,
                username: user.us_username,
                email: user.us_email,
                password: user.us_password,
                role: user.us_role,
                department: user.us_department,
                createdAt: user.us_created_at,
            }))
            res.status(200).send(result)
        } else {
            res.status(404)
        }
    } catch (error) {
        res.status(500)
    }
}

export async function createUser(req: Request, res: Response) {
    try {

        const userRole = (req as any).user.role
        if (userRole !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Admins only" })
        }
        let { username, email, password, role, department }: User = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        const latestUser = await prisma.user.findFirst({
            orderBy: {
                us_id: 'desc',
            },
        })

        const nextId = (latestUser?.us_id ?? 0) + 1
        if (!username) {
            const randomWord = faker.word.noun()
            username = `${randomWord}${nextId}`
        }

        const newUser = await prisma.user.create({
            data: {
                us_username: username,
                us_email: email ?? null,
                us_password: hashPassword,
                us_role: role ?? "inspector",
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
        })
        const result = {
            id: newUser.us_id,
            username: newUser.us_username,
            email: newUser.us_email,
            role: newUser.us_role,
            department: newUser.us_department,
            createdAt: newUser.us_created_at.toISOString(),
        }

        res.status(201).json(result)
    } catch (error) {
        res.status(500).send(error)
    }
}


export async function updateProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;
        const { name, age, tel, address } = req.body;
        const imagePath = req.file?.filename || '';

        const user = await prisma.user.findUnique({
            where: { us_id: userId },
            include: {
                profile: {
                    include: {
                        pf_image: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (imagePath && user.profile?.pf_image) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', user.profile.pf_image.im_path);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        let image = null;
        if (imagePath) {
            image = await prisma.image.upsert({
                where: { im_id: user.profile?.pf_image?.im_id || 0 },
                update: {
                    im_path: imagePath,
                    profiles: {
                        connect: { pf_id: user.profile?.pf_id },
                    },
                },
                create: {
                    im_path: imagePath,
                    im_update_by: userId,
                    profiles: {
                        connect: { pf_id: user.profile?.pf_id },
                    },
                },
            });
        }

        // Update profile data
        const updatedProfile = await prisma.profile.update({
            where: { pf_us_id: userId },
            data: {
                pf_name: name,
                pf_age: parseInt(age, 10),
                pf_tel: tel,
                pf_address: address,
                pf_image: image ? { connect: { im_id: image.im_id } } : undefined, // Connect image if it exists
            },
        });

        // Prepare result response
        const result = {
            id: updatedProfile.pf_id,
            name: updatedProfile.pf_name,
            age: updatedProfile.pf_age,
            tel: updatedProfile.pf_tel,
            address: updatedProfile.pf_address,
            userId: updatedProfile.pf_us_id,
            imagePath: image ? image.im_path : null, // Return image path if available
        };

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user profile' }); // Improved error handling
    }
}


export async function getProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId
        const id = parseInt(req.params.id, 10)
        let user = null
        if (!id) {
            user = await prisma.user.findUnique({
                where: { us_id: userId },
                include: {
                    profile: {
                        include: {
                            pf_image: true
                        }
                    },
                },
            })
        }
        else {
            user = await prisma.user.findUnique({
                where: { us_id: id },
                include: {
                    profile: {
                        include: {
                            pf_image: true
                        }
                    },
                },
            })
        }

        if (!user) {
            return res.status(404)
        }

        const profile = user.profile || null
        const result: User = {
            id: user.us_id,
            username: user.us_username,
            email: user.us_email,
            role: user.us_role,
            department: user.us_department,
            createdAt: user.us_created_at.toISOString(),
            profile: profile ? {
                id: profile.pf_id,
                name: profile.pf_name || undefined,
                age: profile.pf_age || undefined,
                tel: profile.pf_tel || undefined,
                address: profile.pf_address || undefined,
                image: profile.pf_image ? {
                    id: profile.pf_image.im_id,
                    path: profile.pf_image.im_path,
                } : null,
                userId: profile.pf_us_id
            } : undefined
        }

        res.status(200).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch user profile' })
    }
}

export async function getAllProfile(req: Request, res: Response) {
    try {
        const allUsers = await prisma.user.findMany({
            include: {
                profile: {
                    include: {
                        pf_image: true
                    }
                },
            },
        })

        if (allUsers) {

            const result: User[] = allUsers.map((user: any) => ({
                id: user.us_id,
                username: user.us_username,
                email: user.us_email,
                role: user.us_role,
                department: user.us_department,
                profile: {
                    id: user.profile.pf_id,
                    name: user.profile.pf_name,
                    age: user.profile.pf_age,
                    tel: user.profile.pf_tel,
                    address: user.profile.pf_address,
                    image: user.profile.pf_image ? {
                        id: user.profile.pf_image.im_id,
                        path: user.profile.pf_image.im_path,
                    } : null,
                    userId: user.pf_us_id
                },
            }))
            res.status(200).json(result)
        } else {
            response.status(404)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch user profile' })
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
            return res.status(403).json({ message: "Access Denied: You must be the owner of this account or an admin" });
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
            where: { us_id: id },
            data: updateData,
        });

        const result = {
            id: updatedUser.us_id,
            username: updatedUser.us_username,
            email: updatedUser.us_email,
            role: updatedUser.us_role,
            department: updatedUser.us_department,
            createdAt: updatedUser.us_created_at.toISOString(),
        };

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const role = (req as any).user.role;

        if (role !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Admin only" });
        }

        const user = await prisma.user.findUnique({
            where: { us_id: id },
            include: { profile: true, zone: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ตรวจสอบว่ามี Zone ที่เชื่อมโยงอยู่หรือไม่
        if (user.zone) {
            // ลบข้อมูลที่เชื่อมโยงกับ PatrolResult
            const patrolResults = await prisma.patrolResult.findMany({
                where: { pr_itze_ze_id: user.zone.ze_id },
            });

            for (const patrolResult of patrolResults) {
                // ลบ Comment ที่อ้างถึง PatrolResult นี้
                await prisma.comment.deleteMany({
                    where: { cm_pr_id: patrolResult.pr_id },
                });

                // ลบ Defect ที่อ้างถึง PatrolResult นี้
                await prisma.defect.deleteMany({
                    where: { df_pr_id: patrolResult.pr_id },
                });
            }

            // ลบข้อมูลใน PatrolResult ที่อ้างถึง Zone
            await prisma.patrolResult.deleteMany({
                where: { pr_itze_ze_id: user.zone.ze_id },
            });

            // ลบ Zone หลังจากจัดการข้อมูลที่เชื่อมโยงเสร็จ
            await prisma.zone.delete({
                where: { ze_us_id: id },
            });
        }

        // ลบ Profile ถ้ามี
        if (user.profile) {
            await prisma.profile.delete({
                where: { pf_us_id: id },
            });
        }

        // ลบ User หลังจากจัดการ Zone และ Profile
        await prisma.user.delete({
            where: { us_id: id },
        });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}


