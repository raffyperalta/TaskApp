import express, { NextFunction, Request, Response } from 'express';
import prisma from '../config/prisma';
import jwt from 'jsonwebtoken';

const bcrypt = require('bcrypt');

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const email = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }
    
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = {
      email: email,
      password: hashedPassword,
      roleId: 1
    };

    const newUser = await prisma.user.create({
      data: user,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error)
  }
};

export const modifyPassword = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (!id) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    if (!newPassword || !oldPassword) {
      res.status(400).json({ error: "Fill up missing fields" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.log("Password:" + oldPassword)
    console.log("User Password:"+user.password)
    const isOldPassword = await bcrypt.compare(oldPassword, user.password)
    if (!isOldPassword) {
      res.status(400).json({ error: "Old password is incorrect" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { password: hashedPassword },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error modifying password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try{
    const email = req.body.email;
    const password = req.body.password;
    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
    }else {
      const accessToken = process.env.ACCESS_TOKEN_SECRET;
      console.log("Access Token: " + accessToken);
      if (!accessToken) {
        res.status(500).json({ error: "JWT secret is not defined" });
        return;
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, roleId: user.roleId },
        accessToken, // Use a strong secret in production!
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email, roleId: user.roleId }
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
