"use client";

import { useEffect, useState } from "react";
import { Task } from "@/lib/db/schema";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const handleCreateTask = async (data: Partial<Task>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to create task");
      
      await fetchTasks();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!selectedTask) return;

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to update task");
      
      await fetchTasks();
      setSelectedTask(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete task");
      
      await fetchTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Task Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedTask(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTask ? "Edit Task" : "Create New Task"}
              </DialogTitle>
            </DialogHeader>
            <TaskForm
              task={selectedTask}
              onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
            />
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
          <p className="text-gray-600">Create your first task to get started!</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}