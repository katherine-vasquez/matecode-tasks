import { useEffect, useState } from "react";
import { subscribeToTasks } from "../services/taskService";
import type { Task } from "../types/task";
import { useAuth } from "./useAuth";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToTasks(user.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { tasks, loading };
}