import bcrypt from "bcrypt";
import { prisma } from "../Utils/database";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken'
import multer, { Multer } from 'multer';
const jwt = require('jsonwebtoken')



declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export async function login(req: Request, res: Response) {
  const { username, password, rememberMe } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { us_username: username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" })
    }

    const passwordMatch = await bcrypt.compare(password, user.us_password)

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" })
    }
    const token = jwt.sign({ userId: user.us_id, role: user.us_role }, process.env.JWT_SECRET, { expiresIn: "1h" })
    // Set HttpOnly cookie with the token
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000
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

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken

  if(!token) {
    return res.status(401).json({ message: "Access Denied, No Token Provided"})
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next();
  } catch (error) {
    return  res.status(400).json({ message: "Invalid Token"})
  }
}



const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/'); // Keep the upload path for file storage
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    callback(null, uniqueSuffix); // Store only the filename
  }
});

export const upload = multer({ storage: storage });

