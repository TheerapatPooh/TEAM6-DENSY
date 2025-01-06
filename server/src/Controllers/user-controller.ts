import prisma from "@Utils/database.js";
import { Request, response, Response } from "express";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { profile } from "console";

/**
 * คำอธิบาย: ฟังก์ชันสำหรับสร้าง User ใหม่
 * Input: 
 * - req.body: { username: String, email: String | null, password: String, role: String, department: String | null }
 * Output: JSON object ข้อมูล User ที่ถูกสร้าง
**/
export async function createUser(req: Request, res: Response) {
  try {
    let { username, email, password, role, department } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const latestUser = await prisma.user.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const nextId = (latestUser?.id ?? 0) + 1;
    if (!username) {
      const randomWord = faker.word.noun();
      username = `${randomWord}${nextId}`;
    }

    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email ?? null,
        password: hashPassword,
        role: role ?? "inspector",
        department: department || null,
      },
    });

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
    res.status(500)
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดตข้อมูลส่วนตัวของ User
 * Input:
 * - (req as any).user.userId: number
 * - req.body: { name: String | null, age: number | null, tel: String | null, address: String | null }
 * - req.file?.filename: String (optional, path ของไฟล์รูปภาพ)
 * Output: JSON object ข้อมูล profile ที่ถูกอัปเดต หรือ error หากไม่พบ User
**/
export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const imagePath = req.file?.filename || ""; // Use the filename created by multer

    // Find the user in the database
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
      res.status(404).json({ error: "User not found" });
      return 
    }

    function getUploadsPath(): string {
      const currentDir = process.cwd();
      return path.join(currentDir, 'uploads'); // Adjust path as needed
    }

    const uploadsPath = getUploadsPath();

    console.log("imagePath: ", imagePath);
    console.log("user.profile.image: ", user.profile?.image?.path);

    // Delete old image file if it exists
    if (imagePath && user.profile?.image) {
      const oldImagePath = path.join(uploadsPath, user.profile.image.path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    let image = null;
    if (imagePath) {
      // Upsert image (update if exists, create if not)
      image = await prisma.image.upsert({
        where: { id: user.profile?.image?.id || 0 },
        update: {
          path: imagePath,
          updatedBy: userId,
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

    // Update profile in the database
    const updatedProfile = await prisma.profile.update({
      where: { userId: userId },
      data: {
        imageId: image?.id || null, // Link the image if available
      },
    });

    res.status(200).json(updatedProfile);
    return 
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล User 
 * Input: 
 * - req.query: { profile: "true" | "false", image: "true" | "false", password: "true" | "false" } (optional)
 * - req.params.id: number (optional, ถ้าไม่ระบุจะดึงข้อมูล User ที่ login อยู่)
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
        .json({ message: "Access Denied: Only admins can access other users' data" });
      return
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
          zone: true
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
          zone: true
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
    res.status(500)
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับดึงข้อมูล User ทั้งหมด
 * Input: 
 * - req.query: { profile: "true" | "false", image: "true" | "false" } (optional)
 * Output: JSON array ข้อมูล User รวมถึง profile และ image หากมีการร้องขอ
**/
export async function getAllUsers(req: Request, res: Response) {
  try {
    const includeProfile = req.query.profile === "true";
    const includeImage = req.query.image === "true";
    const includeUsername = req.query.user === "true";

    const allUsers = await prisma.user.findMany({
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

    if (allUsers) {
      let result = allUsers;
      res.status(200).json(result);
      return;
    } else {
      response.status(404);
      return;
    }
  } catch (error) {
    res.status(500)
    return;
  }
}

/**
 * คำอธิบาย: ฟังก์ชันสำหรับอัปเดตข้อมูล User
 * Input: 
 * - req.params.id: number (ID ของ User ที่จะอัปเดต)
 * - req.body: { username: String, email: String | null, password: String, role: String, department: String | null }
 * Output: JSON object ข้อมูล User หลังการอัปเดต
 * Note: admin เท่านั้นที่สามารถอัปเดต role และ username ได้
**/
export async function updateUser(req: Request, res: Response) {
  try {
    const loggedInUserId = (req as any).user.userId;
    const loggedInUserRole = (req as any).user.role;
    const id = parseInt(req.params.id, 10);
    const { username, name, email, tel, address, password, role, department } = req.body;
    const active = JSON.parse(req.body.active)
    const age = parseInt(req.body.age)

    // ตรวจสอบว่าผู้ใช้ที่ล็อกอินอยู่เป็นเจ้าของบัญชีที่กำลังถูกอัปเดต หรือเป็น admin
    if (loggedInUserId !== id && loggedInUserRole !== "admin") {
      res.status(403).json({
        message:
          "Access Denied: You must be the owner of this account or an admin",
      });
      return;
    }
    // อัปเดตข้อมูลผู้ใช้
    if (loggedInUserRole !== "admin") {
      if (username || email || password || role || department) {
        await prisma.user.update({
          where: { id: id },
          data: {
            email: email,
            password: password ? await bcrypt.hash(password, 10) : undefined,
            active: active
          },
        });
      }
      await prisma.profile.update({
        where: { id: id },
        data: {
          name: name,
          age: age,
          tel: tel,
          address: address,
        },
      })

    } else {
        await prisma.user.update({
          where: { id: id },
          data: {
            password: password ? await bcrypt.hash(password, 10) : undefined,
            active: active,
            role: role
          },
        });
      

      await prisma.profile.update({
        where: { id: id },
        data: {
          name: name,
          age: age,
          tel: tel,
          address: address,
        },
      })

    }

    const result = {
      id: id,
      username: username,
      email: email,
      age: age,
      tel: tel,
      address: address,
      role: role,
      department: department,
      active: active,
    };

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500)
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
    res.status(500)
    return;
  }
}
