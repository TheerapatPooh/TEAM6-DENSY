import { prisma } from '@Utils/database.js'
import { Request, response, Response } from 'express'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'

export async function createUser(req: Request, res: Response) {
    try {
        // Check if the logged-in user has an admin role
        const userRole = (req as any).user.role
        if (userRole !== 'admin') {
            res.status(403).json({ message: "Access Denied: Admins only" })
            return
        }
        // Extract user data from request body and hash the password
        let { username, email, password, role, department } = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        const latestUser = await prisma.user.findFirst({
            orderBy: {
                id: 'desc',
            },
        })
        // Get the latest user to calculate the next ID
        const nextId = (latestUser?.id ?? 0) + 1
        // Generate a random username if not provided
        if (!username) {
            const randomWord = faker.word.noun()
            username = `${randomWord}${nextId}`
        }
        // Create a new user and profile in the database
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
        // Fetch the user and their associated profile and image
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
        // Delete the old image file if a new one is provided
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

        let result = updatedProfile
        res.status(200).json(result);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user profile' }); // Improved error handling
        return
    }
}

// Function to get user details
export async function getUser(req: Request, res: Response) {
    try {
        // Parse query parameters for including profile, image, and password
        const includeProfile = req.query.profile === "true";
        const includeImage = req.query.image === "true";
        const includePassword = req.query.password === "true";
        // Retrieve the user ID from request or logged-in user context
        const userId = (req as any).user.userId
        const id = parseInt(req.params.id, 10)
        // Fetch user details based on the ID
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
// Function to get all users
export async function getAllUser(req: Request, res: Response) {
    try {
        // Parse query parameters for including profile and image
        const includeProfile = req.query.profile === "true";
        const includeImage = req.query.image === "true";
        // Fetch all users with optional profile and image inclusion
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
// Function to update a user's data
export async function updateUser(req: Request, res: Response) {
    try {
        // Get logged-in user's ID and role, and the target user's ID from the request
        const loggedInUserId = (req as any).user.userId;
        const loggedInUserRole = (req as any).user.role;
        const id = parseInt(req.params.id, 10);
        const { username, email, password, role, department } = req.body;

         // Check permissions for updating the user
        if (loggedInUserId !== id && loggedInUserRole !== 'admin') {
            res.status(403).json({ message: "Access Denied: You must be the owner of this account or an admin" });
            return
        }
        // Prepare data for updating
        const updateData: any = {
            us_email: email,
            us_password: password ? await bcrypt.hash(password, 10) : undefined,
            us_department: department,
        };

        // Only admin can update username and role
        if (loggedInUserRole === 'admin') {
            updateData.us_username = username;
            updateData.us_role = role;
        }

        // Update the user in the database
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
// Function to delete a user
export async function deleteUser(req: Request, res: Response) {
    try {
        // Get the user ID from the request and logged-in user's role
        const id = parseInt(req.params.id, 10);
        const role = (req as any).user.role;
        // Only admin can delete users
        if (role !== 'admin') {
            res.status(403).json({ message: "Access Denied: Admin only" });
            return
        }
        // Fetch the user and their related profile and zone
        const user = await prisma.user.findUnique({
            where: { id: id },
            include: { profile: true, zone: true },
        });
        // Handle case where the user is not found
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Remove related zone-user , comment, defect , PatrolResult , Profile connections and last delete User
        if (user.zone) {
            const patrolResults = await prisma.patrolResult.findMany({
                where: { zoneId: user.zone.id },
            });

            for (const patrolResult of patrolResults) {
                await prisma.comment.deleteMany({
                    where: { patrolResultId: patrolResult.id },
                });

                await prisma.defect.deleteMany({
                    where: { patrolResultId: patrolResult.id },
                });
            }

            await prisma.patrolResult.deleteMany({
                where: { zoneId: user.zone.id },
            });

            await prisma.zone.delete({
                where: { userId: id },
            });
        }

        if (user.profile) {
            await prisma.profile.delete({
                where: { userId: id },
            });
        }

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