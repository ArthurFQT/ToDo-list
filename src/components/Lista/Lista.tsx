import {
  ChangeEvent,
  FormEvent,
  InvalidEvent,
  useEffect,
  useState,
} from "react";
import { Task } from "../Task/Task";
import Clipboard from "../../assets/Clipboard.svg";
import axios from "axios";
import { PlusCircle } from "phosphor-react";
import styles from "./Lista.module.css";

interface TaskType {
  uid: number; // Alterado para number, pois o id agora é um número
  task: string;
  completed: boolean;
}

export function List() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios
      .get<TaskType[]>("https://api-crud-six.vercel.app/itens")
      .then((response) => {
        console.log(response.data); // Verifique o formato da resposta
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar tarefas:", error);
      });
  }, []);
  

  const totalTasks = tasks.length;

  async function handleCreateNewTask(event: FormEvent) {
    event.preventDefault();

    const newTaskObject = {
      task: newTask,
      completed: false, // Setando o completed como false por padrão
    };

    try {
      const response = await axios.post<TaskType>(
        "https://api-crud-six.vercel.app/itens",
        newTaskObject
      );
      const createdTask = response.data;

      setTasks([...tasks, createdTask]);
      setNewTask("");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  }

  function handleNewTaskChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("");
    setNewTask(event.target.value);
  }

  function handleCreateNewTaskInvalid(
    event: InvalidEvent<HTMLTextAreaElement>
  ) {
    event.target.setCustomValidity("Esse campo é obrigatório");
  }

  async function deleteTask(taskId: number) {
    try {
      await axios.delete(`https://api-crud-six.vercel.app/itens/${taskId}`);
      const tasksWithoutDeletedOne = tasks.filter((task) => task.uid !== taskId);
      setTasks(tasksWithoutDeletedOne);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  }

  async function toggleTaskCompletion(taskId: number) {
    console.log("Task ID:", taskId); // Verifique o ID que está sendo passado

    const taskToToggle = tasks.find((task) => task.uid === taskId);

    if (taskToToggle) {
      // Alterando o valor de completed para o oposto
      const updatedTask = {
        ...taskToToggle,
        completed: !taskToToggle.completed, // Garantindo que seja um booleano
      };

      try {
        // Enviando o valor correto para a API
        await axios.put(
          `https://api-crud-six.vercel.app/itens/${taskId}`,
          updatedTask
        );

        // Atualizando o estado com a tarefa alterada
        const updatedTasks = tasks.map((task) =>
          task.uid === taskId ? updatedTask : task
        );
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
      }
    } else {
      console.error("Tarefa não encontrada para o ID:", taskId);
    }
  }

  return (
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
      </div>

      {tasks.length === 0 ? (
        <div className={styles.noTask}>
          <img src={Clipboard} />
          <strong>Você ainda não tem tarefas cadastradas</strong>
          <p>Crie tarefas e organize seus itens a fazer</p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <Task
              key={task.uid}
              id={task.uid}
              content={task.task}
              completed={task.completed}
              onDeleteTask={deleteTask}
              onToggleComplete={toggleTaskCompletion}
            />
          ))}
        </div>
      )}
    </main>
  );
}
