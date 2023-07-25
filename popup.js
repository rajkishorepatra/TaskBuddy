// Function to load tasks from storage
function loadTasks() {
    chrome.storage.sync.get(["tasks"], (result) => {
        const tasks = result.tasks || [];
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const li = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("click", () => {
                completeTask(task.id);
            });

            const textNode = document.createTextNode(task.text);
            li.appendChild(checkbox);
            li.appendChild(textNode);
            taskList.appendChild(li);
        });
    });
}

// Function to save tasks to storage
function saveTasks(tasks) {
    chrome.storage.sync.set({ tasks });
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText) {
        chrome.storage.sync.get(["tasks"], (result) => {
            const tasks = result.tasks || [];
            const newTask = {
                id: Date.now(),
                text: taskText,
            };
            tasks.push(newTask);
            saveTasks(tasks);

            taskInput.value = "";
            loadTasks();
        });
    }
}

// Function to complete a task
function completeTask(id) {
    setTimeout(() => {
        chrome.storage.sync.get(["tasks"], (result) => {
            const tasks = result.tasks || [];
            const updatedTasks = tasks.filter((task) => task.id !== id);
            saveTasks(updatedTasks);
            loadTasks();
        });
    }, 1000);

}

document.getElementById("addTaskButton").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Load tasks when the popup is opened
loadTasks();
