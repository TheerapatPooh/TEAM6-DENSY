import prisma from "@Utils/database.js";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { uploadsPath } from "@Controllers/util-controller.js";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง User ใหม่
 * Input:
 * - req.body: { username: String, email: String | null, password: String, role: String, department: String | null }
 * Output: JSON object ข้อมูล User ที่ถูกสร้าง
 **/
export async function createUser(req: Request, res: Response) {
  try {
    let { username, email, password, role, department } = req.body;
    const hashPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่านเพื่อความปลอดภัย

    // หาผู้ใช้ล่าสุดจากฐานข้อมูลเพื่อคำนวณ id ถัดไป

    const latestUser = await prisma.user.findFirst({
      orderBy: {
        id: "desc",
      },
    });
    // คำนวณ id ถัดไปโดยใช้ id ของผู้ใช้ล่าสุด

    const nextId = (latestUser?.id ?? 0) + 1;
    if (!username) {
      // ถ้าไม่ได้ระบุ username ให้สร้างชื่อผู้ใช้ใหม่โดยใช้คำนามจาก faker

      const randomWord = faker.word.noun();
      username = `${randomWord}${nextId}`;
    }
    // สร้างผู้ใช้ใหม่ในฐานข้อมูล

    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email ?? null,
        password: hashPassword,
        role: role ?? "inspector",
        department: department || null,
      },
    });
    // สร้างโปรไฟล์เริ่มต้นสำหรับผู้ใช้ใหม่

    await prisma.profile.create({
      data: {
        userId: newUser.id,
        name: null,
        age: null,
        tel: null,
        address: null,
      },
    });
    const user = await prisma.user.findUnique({
      // ดึงข้อมูลผู้ใช้ใหม่จากฐานข้อมูลพร้อมโปรไฟล์

      where: {
        id: newUser.id,
      },
      include: {
        profile: {
          include: {
            image: true,
          },
        },
      },
    });

    let result = user;
    res.status(201).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดตข้อมูลส่วนตัวของ User
 * Input:
 * - (req as any).user.userId: number
 * - req.file?.filename: String (optional, path ของไฟล์รูปภาพ)
 * Output: JSON object ข้อมูล profile ที่ถูกอัปเดต หรือ error หากไม่พบ User
 **/
export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    if (!req.file) {
      res.status(400).json({ error: 'No image uploaded' });
      return 
    }

    // 1. ดึงข้อมูลรูปเก่าจากฐานข้อมูลก่อนอัปเดต
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { image: true } } }
    });
    const oldImagePath = currentUser?.profile?.image?.path;
    const newImagePath = path.join("profiles", userId.toString(), req.file.filename);
    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              image: {
                create: {
                  path: newImagePath,
                  updatedBy: userId
                }
              }
            },
            update: {
              image: {
                upsert: {
                  create: {
                    path: newImagePath,
                    updatedBy: userId
                  },
                  update: {
                    path: newImagePath,
                    updatedBy: userId
                  }
                }
              }
            }
          }
        }
      },
      include: { profile: { include: { image: true } } }
    });

    // 4. ลบไฟล์รูปเก่าจากระบบถ้ามี
    if (oldImagePath) {
      const fullOldPath = path.join(uploadsPath, oldImagePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
      }
    }

    res.status(200).json(updatedProfile);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล User
 * Input:
 * - req.query: { profile: boolean, image: boolean, password: boolean} (optional)
 * - req as any:{userId:number,userRole:String}
 * Output: JSON object ข้อมูล User รวมถึง profile และ image หากมีการร้องขอ
 **/
export async function getUser(req: Request, res: Response) {
  try {
    const includeProfile = req.query.profile === "true";
    const includeImage = req.query.image === "true";
    const includePassword = req.query.password === "true";

    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const id = parseInt(req.params.id, 10);
    let user = null;
    if (id && userRole !== "admin" && userId !== id && includePassword) {
      res
        .status(403)
        .json({
          message: "Access Denied: Only admins can access other users' data",
        });
      return;
    }
    if (!id || id === userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          password: includePassword ? true : false,
          role: true,
          createdAt: true,
          active: true,
          profile: includeProfile
            ? {
              include: {
                image: includeImage,
              },
            }
            : undefined,
          zone: true,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          username: true,
          email: true,
          password: includePassword ? true : false,
          role: true,
          createdAt: true,
          active: true,
          profile: includeProfile
            ? {
              include: {
                image: includeImage,
              },
            }
            : undefined,
          zone: true,
        },
      });
    }

    if (!user) {
      res.status(404);
      return;
    }

    let result = user;
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล User ทั้งหมด
 * Input:
 * - req.query: { profile: boolean, image: boolean, "role": "admin" | "inspector" | "supervisor" } (optional)
 * Output: JSON array ข้อมูล User รวมถึง profile และ image หากมีการร้องขอ
 **/
export async function getAllUsers(req: Request, res: Response) {
  try {
    // Fetch query parameters
    const includeProfile = req.query.profile === "true";
    const includeImage = req.query.image === "true";
    const includeUsername = req.query.user === "true";
    const roles = req.query.roles as string; // Comma-separated roles (e.g., "admin,inspector")
    const active = req.query.active; // "true" or "false"
    const search = req.query.search as string;

    // Construct the where clause for filtering
    const whereClause: any = {};

    // Filter by roles (multiple roles)
    if (roles) {
      const roleArray = roles.split(",").map((role) => role.trim());
      whereClause.role = { in: roleArray }; // Matches any role in the array
    }

    // Add active status filter if provided
    if (active !== undefined) {
      whereClause.active = active === "true"; // Convert "true"/"false" string to boolean
    }

    
    // Add search functionality with priority on profile.name, then username
    if (search) {
      const searchNumber = Number(search);
    
      whereClause.OR = [
        { profile: { name: { contains: search } } }, // Search by profile name
        { username: { contains: search } }, // Search by username
      ];
    
      // If search is a valid number, add exact id match separately
      if (!isNaN(searchNumber)) {
        whereClause.OR.push({ id: searchNumber });
      }
    }

    // Fetch users from the database with the specified filters
    const allUsers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: includeUsername,
        email: true,
        role: true,
        createdAt: true,
        active: true,
        profile: includeProfile
          ? {
            include: {
              image: includeImage,
            },
          }
          : undefined,
      },
    });

    if (allUsers.length) {
      res.status(200).json(allUsers);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}


/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดตข้อมูล User
 * Input:
 * - req.params.id: number (ID ของ User ที่จะอัปเดต)
 * - req.body: {
 *     username: String,     
 *     email: String | null,  
 *     password: String,     
 *     role: String,         
 *     department: String | null,  
 *     name: String | null,   
 *     age: number | null,    
 *     tel: String | null,    
 *     address: String | null  
 * }
 * Output: JSON object ข้อมูล User หลังการอัปเดต
 * Note: admin เท่านั้นที่สามารถอัปเดต role และ username ได้
 **/
export async function updateUser(req: Request, res: Response) {
  try {
    const loggedInUserId = (req as any).user.userId;
    const loggedInUserRole = (req as any).user.role;
    const id = parseInt(req.params.id, 10);
    const { username, name, age, email, tel, address, password, role, department, active } =
      req.body;
    const updateUser: any = {};
    const updateProfile: any = {};
    if (username !== undefined) updateUser.username = username;
    if (email !== undefined) updateUser.email = email;
    if (password !== undefined)
      updateUser.password = await bcrypt.hash(password, 10);
    if (role !== undefined) updateUser.role = role;
    if (department !== undefined) updateUser.department = department;
    if (name !== undefined) updateProfile.name = name;
    if (age !== undefined) updateProfile.age = parseInt(age, 10);
    if (tel !== undefined) updateProfile.tel = tel;
    if (address !== undefined) updateProfile.address = address;
    if (active !== undefined) updateUser.active = active;

    // ตรวจสอบว่าผู้ใช้ที่ล็อกอินอยู่เป็นเจ้าของบัญชีที่กำลังถูกอัปเดต หรือเป็น admin
    if (loggedInUserId !== id && loggedInUserRole !== "admin") {
      res.status(403).json({
        message:
          "Access Denied: You must be the owner of this account or an admin",
      });
      return;
    }

    // อัปเดตข้อมูลผู้ใช้
    await prisma.user.update({
      where: { id: id },
      data: updateUser,
    });

    await prisma.profile.update({
      where: { id: id },
      data: updateProfile,
    });

    const result = await prisma.user.findUnique({
      where: { id: id },
      include: {
        profile: {
          include: {
            image: true,
          },
        },
      },
    });

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับลบ User (เปลี่ยนสถานะเป็น inactive)
 * Input: req.params.id: Int (ID ของ User ที่จะลบ)
 * Output: JSON message ยืนยันการลบ User สำเร็จ
 **/
export async function removeUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);

    const user = await prisma.user.findUnique({
      where: { id: id },
      include: { profile: true, zone: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await prisma.user.update({
      where: { id: id },
      data: {
        active: false,
      },
    });

    res.status(200).json({ message: "User has been deactivated successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
    return;
  }
}
