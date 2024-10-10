import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  let maxLength = 70;

  const userName = "jhow";

  // Handlers
  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  const handlerKeyDown = (e) => {
    if (e.key === "Enter" && inputValue !== "") {
      createToDo();
      setInputValue(""); // Limpia el input después de agregar tarea
    }
  };

  // GET Tareas
  const getUserTareas = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`https://playground.4geeks.com/todo/users/${userName}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setTareas(result.todos))
      .catch((error) => console.error(error));
  };

  // GET Users
  const getUsers = () => {
    const requestOptions = {
      method: "GET",
    };
    fetch("https://playground.4geeks.com/todo/users?offset=0&limit=100", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.users) {
          const userNames = result.users.map((user) => user.name);
          const userExists = userNames.includes(user1);
          if (userExists) {
            console.log("Ya existe este usuario");
          } else {
            createUser();
          }
        }
      })
      .catch((error) => console.error(error));
  };

  // CREATE Task
  const createToDo = () => {
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

    fetch(`https://playground.4geeks.com/todo/todos/${userName}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setTareas([...tareas, result]))
      .catch((error) => console.error(error));
  };
  // useEffect Hooks
  useEffect(() => {
    if (tareas.length === 10) {
      setError(true);
    } else setError(false);
  }, [tareas]);

  useEffect(() => {
    if (inputValue.length === maxLength) {
      setError2(true);
    } else {
      setError2(false);
    }
  }, [inputValue]);

  useEffect(() => {
    getUserTareas();
    getUsers();
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
        maxLength={70}
        disabled={tareas.length >= 10}
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
     
      <div>{tareas.length} Tareas</div>
    </div>
  );
};

export default Home;
