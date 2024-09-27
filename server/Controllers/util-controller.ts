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
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({userId: user.id, role: user.role},'secret',{ expiresIn: "1h"})

      res.status(200).json({ message: "Login Success", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
}
