import React, { useState, useEffect } from "react";

// Crear el componente Home
const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);

  
  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  const handlerKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      createToDo(); 
      setInputValue(""); // borrar valor en el label al enviar respuesta
    }
  };

  // GET 
  const getUserTareas = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`https://playground.4geeks.com/todo/users/jhow`, requestOptions)
      .then((response) => response.json())
      .then((result) => setTareas(result.todos))
      .catch((error) => console.error(error));
  };

  // CREATE 
  const createToDo = () => {
    if (inputValue.trim() === "") {
      console.error("Tarea vacía, no se puede agregar.");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      label: inputValue,
      is_done: false,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(`https://playground.4geeks.com/todo/todos/jhow`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Tarea agregada:", result);
        setTareas([...tareas, result]);
      })
      .catch((error) => console.error("Error al agregar tarea:", error));
  };

  // DELETE 
  const deleteTarea = (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`https://playground.4geeks.com/todo/todos/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          setTareas(tareas.filter((tarea) => tarea.id !== id)); 
        }
      })
      .catch((error) => console.error("Error al eliminar tarea:", error));
  };

  // DELETE ALL
  const deleteTareas = () => {
    const deletePromises = tareas.map((tarea) => {
      return fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    });

    Promise.all(deletePromises)
      .then(() => {
        console.log("Todas las tareas han sido eliminadas");
        setTareas([]); // Vaciar la lista de tareas en el estado
      })
      .catch((error) => console.error("Error al eliminar todas las tareas:", error));
  };

  // useEffect Hooks
  useEffect(() => { setError(false); }, [tareas]);

  useEffect(() => {
    setError2(false);
  }, [inputValue]);

  useEffect(() => {
    getUserTareas(); // Obtener tareas en la API
  }, []);

  return (
    <div className="Container">
      <h1>TODOS</h1>
      <input
        type="text"
        placeholder="Indica Nueva Tarea"
        value={inputValue}
        onChange={inputHandler}
        onKeyDown={handlerKeyDown}
      />
      {error && <span className="error">Solo puedes añadir 10 tareas.</span>}
      {error2 && <span className="error">Máximo de 70 caracteres.</span>}
      <ul>
        {tareas.length === 0 ? (
          <li>No hay tareas, añade una tarea</li>
        ) : (
          tareas.map((tarea, index) => (
            <li key={index}>
              {tarea.label}
              <button onClick={() => deleteTarea(tarea.id)}>🗑️</button> 
            </li>
          ))
        )}
      </ul>
      <button onClick={deleteTareas}>Eliminar Todas las Tareas</button>
      <div>{tareas.length} Tareas</div>
    </div>
  );
};

export default Home;
