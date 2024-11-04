import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(params.id)))
      .get();
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedTask = await db
      .update(tasks)
      .set(body)
      .where(eq(tasks.id, parseInt(params.id)))
      .returning()
      .get();
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db
      .delete(tasks)
      .where(eq(tasks.id, parseInt(params.id)))
      .run();
    
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}