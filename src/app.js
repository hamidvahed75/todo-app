/* ANCHOR ==> Ausgewählte HTML-Elemente */

const todoDescription = document.querySelector("#description"); 
const btnAdd = document.querySelector("#btn-add");
const btnRemove = document.querySelector("#btn-delete");
const todosList = document.querySelector("#todo-list-container"); 

const url = "http://localhost:4730/todos"; 

let todos = await getTodosData(); 

renderTodos();

/* ANCHOR ==> Event-Listener hinzufügen */

btnAdd.addEventListener("click", addTodo);
btnRemove.addEventListener("click", removeDoneTodos);
todosList.addEventListener("change", updateTodo); 

/*ANCHOR ==> Funktions-Dekleration */

async function getTodosData() {
  const response = await fetch(url);
  const todosData = await response.json();

  return todosData;
}

async function addTodo(e) {
  e.preventDefault(); 

  if (description.value.length === 0) {
    return; 
  }

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: description.value,
      done: false,
    }),
  });

  const newTodo = await request.json();
  todos.push(newTodo);
  description.value = ""; 

  renderTodos();
}

function renderTodos() {
  todosList.innerText = ""; 

  todos.forEach((todo) => {
  
    const listEl = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "todo" + todo.id;
    checkbox.checked = todo.done;
    checkbox.todoId = todo.id;

    const description = document.createElement("label");
    description.htmlFor = checkbox.id;
    description.innerText = todo.description;

    listEl.appendChild(checkbox);
    listEl.appendChild(description);
    todosList.appendChild(listEl);
  });
}

async function updateTodo(e) {
  try {
    const id = e.target.todoId;
    const updatedTodo = todos.find((todo) => todo.id === id);
    updatedTodo.done = !updatedTodo.done; 

    const response = await fetch(url + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(updatedTodo), 
    });

    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren des Todos."); 
    }

  } catch (error) {
    console.error("Fehler aufgetreten:", error);
  }
}

async function removeDoneTodos() {
  try {
    const todosToRemove = todos.filter((todo) => todo.done === true);
    if (todosToRemove.length === 0) { 
      return;
    }
    const ids = todosToRemove.map((todo) => todo.id);
    for (const id of ids) {
      await fetch(url + "/" + id, {
        method: "DELETE",
      });
    }
    todos = todos.filter((todo) => !ids.includes(todo.id));

    renderTodos();
      } catch(error) {
        console.error("Fehler aufgetreten:", error);
  }
}



  