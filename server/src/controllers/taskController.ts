import express, { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const user = (req as any).user; // Access user info from token
    const userId = user.id;    
    

    if (!title || !description) {
      res.status(400).json({ error: "All fields are required" });
      return
    }

    const newTask = await prisma.task.create({
      data: {
        title: title,
        description: description,
        userId: userId,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    if (!taskId) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    res.status(200).json(deletedTask);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    const { title, description } = req.body;

    if (!taskId) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    if (!title || !description) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title,
        description: description,
      },
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

