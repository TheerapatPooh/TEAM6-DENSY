import bcrypt from "bcrypt";
import { prisma } from "../Utils/database";
import { Request, Response } from "express";
const jwt = require('jsonwebtoken')

export async function login(req: Request, res: Response) {
  const { username, password, rememberMe } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" })
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })
    // Set HttpOnly cookie with the token
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000
    console.log('Setting maxAge:', maxAge)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,  
      sameSite: "none",
      maxAge: maxAge
    })
    
    res.status(200).json({ message: "Login Success", token })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error })
  }
}


export async function logout(req: Request, res: Response) {
  try {
    // ลบ cookie authToken
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // ส่ง response กลับไปหาผู้ใช้เพื่อแจ้งว่า logout สำเร็จ
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
}