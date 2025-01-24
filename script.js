let todo = JSON.parse(localStorage.getItem("todo")) || [];

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("delete_btn");

console.log(todoList)

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default Enter key behavior
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({ text: newTask, disabled: false });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("drag-item");
    li.setAttribute("draggable", "true");
    li.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
      </div>
    `;

    li.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );

    // Drag events for each task
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);
    li.addEventListener("dragenter", handleDragEnter);
    li.addEventListener("dragleave", handleDragLeave);

    todoList.appendChild(li);
  });
  todoCount.textContent = todo.length;
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

// Delete task
function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

// Drag and sort list
const dragList = document.querySelectorAll('.dragList');
let draggedItem = null;

// Drag start event handler
function handleDragStart(event) {
  draggedItem = event.target;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', draggedItem.innerHTML);
  event.target.style.opacity = '0.5';
}

// Drag over event handler
function handleDragOver(event) {
  event.preventDefault();
  const targetItem = event.target;
  if (targetItem !== draggedItem && targetItem.classList.contains('drag-item')) {
    const boundingRect = targetItem.getBoundingClientRect();
    const offset = boundingRect.y + (boundingRect.height / 2);
    if (event.clientY - offset > 0) {
      targetItem.style.borderBottom = 'solid 2px #000';
      targetItem.style.borderTop = '';
    } else {
      targetItem.style.borderTop = 'solid 2px #000';
      targetItem.style.borderBottom = '';
    }
  }
}

// Drop event handler
function handleDrop(event) {
  event.preventDefault();
  const targetItem = event.target;
  if (targetItem !== draggedItem && targetItem.classList.contains("drag-item")) {
    const draggedIndex = [...todoList.children].indexOf(draggedItem);
    const targetIndex = [...todoList.children].indexOf(targetItem);

    // Reorder the tasks array
    const movedTask = todo.splice(draggedIndex, 1)[0];
    todo.splice(targetIndex, 0, movedTask);

    // Save the updated task order to localStorage
    saveToLocalStorage();
    displayTasks();
  }

  targetItem.style.borderTop = "";
  targetItem.style.borderBottom = "";
  draggedItem.style.opacity = "";
  draggedItem = null;
}

// Drag enter event handler
function handleDragEnter(event) {
  event.preventDefault();
  const targetItem = event.target;
  if (targetItem !== draggedItem && targetItem.classList.contains("drag-item")) {
    targetItem.style.borderTop = "solid 2px #000";
  }
}

// Drag leave event handler
function handleDragLeave(event) {
  const targetItem = event.target;
  if (targetItem.classList.contains("drag-item")) {
    targetItem.style.borderTop = "";
    targetItem.style.borderBottom = "";
  }
}