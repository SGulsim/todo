const form = document.querySelector('#form');
const cardInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

form.addEventListener('submit', addTask);

tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);


let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) =>  renderTasks(task));
}

checkEmptyList();

function addTask(event) {
    event.preventDefault();

    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    tasks.push(newTask);
    
    saveToLocalStorage();

    renderTasks(newTask);

    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();

}

function deleteTask(event) {

    if (event.target.dataset.action !== 'delete') return;

    const parentTarget = event.target.closest('li');

    const id = Number(parentTarget.id);

    tasks = tasks.filter((task) => task.id !== id);

    parentTarget.remove();

    if (tasksList.children.length === 1) {
        emptyList.classList.remove('none');
    }

    checkEmptyList();
    
    saveToLocalStorage();

}

function doneTask(event) {

    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('li');

    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    saveToLocalStorage();

}

function saveHTMLtoLS() {
    localStorage.setItem('tasksHTML', tasksList.innerHTML);
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    return localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(task) {

    const cssClass = task.done ? 'task-title--done' : 'task-title';

    const taskHtml = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`

    tasksList.insertAdjacentHTML('beforeend', taskHtml);

}
