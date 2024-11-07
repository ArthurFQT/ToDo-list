// Task.tsx
import { Trash } from "phosphor-react";
import styles from "./Task.module.css";

interface TaskProps {
  id: number;
  content: string;
  completed: boolean;
  onDeleteTask: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
}

export function Task({
  id,
  content,
  completed,
  onDeleteTask,
  onToggleComplete,
}: TaskProps) {
  function handleDeleteTask() {
    onDeleteTask(id);
  }

  function handleToggleComplete() {
    onToggleComplete(id);
  }

  return (
    <div className={styles.task}>
      <div
        className={`${styles.paragraph} ${completed ? styles.completed : ""}`}
      >
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggleComplete}
          className={styles.checkbox}
        />
        <p>{content}</p>
      </div>
      <button
        className={styles.delete}
        onClick={handleDeleteTask}
        title="Deletar tarefa"
      >
        <Trash size={24} />
      </button>
    </div>
  );
}
