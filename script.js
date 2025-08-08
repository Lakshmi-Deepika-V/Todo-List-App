const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const deadlineInput = document.getElementById("dueDateInput");
const toggleThemeBtn = document.getElementById("toggleTheme");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (filter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add(task.priority);
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-top">
        <span>${task.text}</span>
        <div class="task-actions">
          <button onclick="toggleComplete(${index})" title="Mark Complete">✅</button>
          <button onclick="editTask(${index})" title="Edit">✏️</button>
          <button onclick="deleteTask(${index})" title="Delete">🗑️</button>
        </div>
      </div>
      <div class="task-meta">
        Priority: ${task.priority.toUpperCase()} | Deadline: ${task.deadline || "No date"}
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const priority = priorityInput.value;
  const deadline = deadlineInput.value;

  if (!text) {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    text,
    priority,
    deadline,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  deadlineInput.value = "";
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const task = tasks[index];
  const newText = prompt("Edit your task:", task.text);
  if (newText !== null && newText.trim()) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function filterTasks(filter) {
  renderTasks(filter);
}

function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  toggleThemeBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleThemeBtn.textContent = "☀️";
}

// Initial Render
renderTasks();

// Add event listener for theme toggle
toggleThemeBtn.addEventListener("click", toggleTheme);
