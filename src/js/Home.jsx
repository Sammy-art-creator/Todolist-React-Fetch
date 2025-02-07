import React, { useState, useEffect } from "react";
import "./components/index.css";

const TodoList = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Obtener tareas desde la API
  const fetchTasks = () => {
    fetch("https://playground.4geeks.com/todo/users/SammyMor", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos:", data);
        if (Array.isArray(data.todos)) {
          setTasks(data.todos);
        } else {
          console.error("La API no devolvió una lista de tareas válida.");
        }
      })
      .catch((error) => console.error("Error al obtener tareas:", error));
  };

  // Agregar tarea
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && task.trim() !== "") {
      const newTask = { label: task, done: false };

      fetch("https://playground.4geeks.com/todo/todos/SammyMor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
        .then((response) => response.json())
        .then((createdTask) => {
          console.log("Tarea creada:", createdTask);
          setTasks([...tasks, createdTask]);
          setTask("");
        })
        .catch((error) => console.error("Error al agregar tarea:", error));
    }
  };

  // Eliminar tarea
  const handleDelete = (todoId) => {
    const numericId = parseInt(todoId, 10);
    if (isNaN(numericId)) {
      console.error("Error: ID de tarea no es un número:", todoId);
      return;
    }

    console.log("🗑 Eliminando tarea con ID:", numericId);

    fetch(`https://playground.4geeks.com/todo/todos/${numericId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar la tarea");
        return response.text();
      })
      .then((message) => {
        console.log("Respuesta de la API:", message);
        setTasks(tasks.filter((task) => task.id !== numericId));
      })
      .catch((error) => console.error("Error al eliminar tarea:", error));
  };

  return (
    <div className="todo-container">
      <h1>ToDo List</h1>

      <input
        type="text"
        placeholder="What needs to be done?"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="todo-list">
        {tasks.length === 0 ? (
          <p>No tasks, add a task</p>
        ) : (
          tasks.map((task) => (
            <div className="todo-item" key={task.id}>
              <span>{task.label}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(task.id)}
              >
                X
              </button>
            </div>
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <p className="task-count">
          {tasks.length} {tasks.length === 1 ? "item left" : "items left"}
        </p>
      )}
    </div>
  );
};

export default TodoList;
