import styles from "./Lista.module.css";
import { PlusCircle } from "phosphor-react";
import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react";
import { Task } from "../Task/Task";
import Clipboard from "../../assets/Clipboard.svg";

interface TaskType {
  id: number;
  name: string;
  completed: boolean;
}

export function List() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const [newTask, setNewTask] = useState("");

  const totalTasks = tasks.length;
  const tasksCompletas = tasks.filter((task) => task.completed).length;

  function handleCreateNewTask(event: FormEvent) {
    event.preventDefault();

    const newTaskObject = {
      id: new Date().getTime(), // Gera um identificador único baseado no timestamp atual
      name: newTask,
      completed: false,
    };

    setTasks([...tasks, newTaskObject]);
    setNewTask("");
  }

  function handleNewTaskChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("");
    setNewTask(event.target.value);
  }

  function handleCreateNewTaskInvalid(
    event: InvalidEvent<HTMLTextAreaElement>
  ) {
    event.target.setCustomValidity("Esse campo é  obrigatorio");
  }

  function deleteTask(taskId: number) {
    const tasksWithoutDeletedOne = tasks.filter((task) => {
      return task.id !== taskId;
    });

    setTasks(tasksWithoutDeletedOne);
  }

  function toggleTaskCompletion(taskId: number) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  }

  return (
    <>
      <main className={styles.container}>
        <form onSubmit={handleCreateNewTask} className={styles.inputForm}>
          <textarea
            name="tarefa"
            value={newTask}
            placeholder="Adicione uma nova tarefa"
            onChange={handleNewTaskChange}
            required
            onInvalid={handleCreateNewTaskInvalid}
          />
          <button type="submit">
            Criar <PlusCircle size={32} />
          </button>
        </form>

        <div className={styles.list}>
          <p className={styles.feitas}>
            Tarefas criadas <span>{totalTasks}</span>
          </p>
          <p className={styles.concluidas}>
            Concluidas{" "}
            <span>
              {tasksCompletas} de {totalTasks}
            </span>
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className={styles.noTask}>
            <img src={Clipboard} />
            <strong>Você ainda não tem tarefas cadastradas</strong>
            <p>Crie tarefas e organize seus itens a fazer</p>
          </div>
        ) : (
          <div>
            {tasks.map((tasks) => {
              return (
                <Task
                  key={tasks.id}
                  id={tasks.id}
                  content={tasks.name}
                  completed={tasks.completed}
                  onDeleteTask={deleteTask}
                  onToggleComplete={toggleTaskCompletion}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
