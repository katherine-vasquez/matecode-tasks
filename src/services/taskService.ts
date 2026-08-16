import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task } from "../types/task";

const tasksCollection = collection(db, "tasks");

export function subscribeToTasks(
  userId: string,
  callback: (tasks: Task[]) => void
) {
  const q = query(tasksCollection, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        completed: data.completed,
        createdAt: data.createdAt,
      };
    });
    callback(tasks);
  });
}

export async function createTask(
  userId: string,
  title: string,
  description: string
) {
  await addDoc(tasksCollection, {
    userId,
    title,
    description,
    completed: false,
    createdAt: Timestamp.now().toMillis(),
  });
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, updates);
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
  await updateTask(taskId, { completed: !completed });
}