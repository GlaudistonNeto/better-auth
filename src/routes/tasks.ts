import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const tasksRouter = Router();

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
});

const updateTaskSchema = createTaskSchema
  .partial()
  .extend({ completed: z.boolean().optional() })
  .refine((task) => Object.keys(task).length > 0, {
    message: "At least one field must be provided",
  });

function parseTaskId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

tasksRouter.get("/", async (_req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  res.json(tasks);
});

tasksRouter.get("/:id", async (req, res) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid task id" });
    return;
  }

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(task);
});

tasksRouter.post("/", async (req, res) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid task data", details: parsed.error.flatten() });
    return;
  }

  const task = await prisma.task.create({ data: parsed.data });
  res.status(201).json(task);
});

tasksRouter.patch("/:id", async (req, res) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid task id" });
    return;
  }

  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid task data", details: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.task.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const task = await prisma.task.update({ where: { id }, data: parsed.data });
  res.json(task);
});

tasksRouter.delete("/:id", async (req, res) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid task id" });
    return;
  }

  const existing = await prisma.task.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  await prisma.task.delete({ where: { id } });
  res.status(204).end();
});
