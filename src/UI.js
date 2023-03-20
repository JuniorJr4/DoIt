import Task from "./task";
import Storage from "./storage";
import Project from "./projects";
import { format, isValid, isToday, isThisWeek } from "date-fns";

export default class MenuUI {
  static addMenuButtons() {
    const taskBtn = document.getElementById("addTask");
    const inboxBtn = document.getElementById("inbox");
    const todayBtn = document.getElementById("today");
    const thisWeekBtn = document.getElementById("thisWeek");
    const deleteTask = document.getElementById("clearTask");
    const projects = document.getElementById("projects");
    const addProject = document.getElementById("addProject");
    const projSubmit = document.getElementById("projSubmit");
    projects.addEventListener("click", this.projectInbox);
    projSubmit.addEventListener("click", MenuUI.submitProj);
    taskBtn.addEventListener("click", MenuUI.addTaskBtn);
    inboxBtn.addEventListener("click", MenuUI.inboxButton);
    deleteTask.addEventListener("click", MenuUI.clearStorageBtn);
    todayBtn.addEventListener("click", MenuUI.todayTasks);
    thisWeekBtn.addEventListener("click", MenuUI.weekTasks);
    addProject.addEventListener("click", this.addProject);
    Storage.getTaskItems();
    MenuUI.inboxButton();
    let projList = Storage.getAllProj();
    this.listProjects(projList);
  }

  static addTaskBtn() {
    const taskForm = document.getElementById("myForm");
    MenuUI.removeActive();
    taskForm.classList.add("active");
    const taskSubmit = document.getElementById("submitBtn");
    taskSubmit.addEventListener("click", MenuUI.submitTaskBtn);
  }
  static clearStorageBtn() {
    localStorage.clear();
  }

  static removeTaskBtn(e) {
    // const delTask = document.querySelector(
    //   `[data-key="${e.target.dataset.key}"]`
    // );
    const myTask = document.querySelector(
      `[data-key="${e.target.dataset.key}"]`
    );
    localStorage.removeItem("Task-" + e.target.dataset.key);
    myTask.innerHTML = "";
  }
  static removeProjTaskBtn(e) {
    const delTask = document.querySelector(
      `[data-key="${e.target.dataset.key}"]`
    );
    const myTask = document.querySelector(
      `[data-task="${e.target.dataset.task}"]`
    );
    let projToEdit = Storage.getProject(e.target.dataset.key);
    projToEdit.taskList.splice(e.target.dataset.index, 1);
    Storage.storeProj(projToEdit.name, projToEdit);
    MenuUI.projButton(e);
    myTask.innerHTML = "";
  }
  static removeProjBtn(e) {
    const projectList = document.querySelector(".proj-list");
    localStorage.removeItem("Proj-" + e.target.dataset.key);
    let projList = Storage.getAllProj();
    console.log(projList);
    projectList.innerHTML = "";  
    MenuUI.listProjects(projList);
  }
  static submitTaskBtn() {
    const taskForm = document.getElementById("myForm");
    let taskName = document.getElementById("name");
    let dueDate = document.getElementById("due");
    let newTask = new Task(taskName.value, dueDate.value);
    Storage.storeTask(taskName.value, newTask);
    taskName.value = "";
    dueDate.value = "";
    taskForm.classList.remove("active");
  }
  static submitProjTaskBtn(e) {
    const taskForm = document.getElementById("myProjForm");
    const addProjTaskBtn = document.querySelector(".addProjTaskBtn");
    addProjTaskBtn.classList.remove("inactive");
    let taskName = document.getElementById("projTaskName");
    let dueDate = document.getElementById("projTaskDue");
    let projToEdit = Storage.getProject(e.target.dataset.key);
    let newTask = new Task(taskName.value, dueDate.value);
    projToEdit.taskList.push([newTask.name, new Date(newTask.dueDate)]);
    Storage.storeProj(projToEdit.name, projToEdit);
    taskForm.classList.remove("active");
    taskName.value = "";
    dueDate.value = "";
    MenuUI.projButton(e);
  }

  static submitProj() {
    let projName = document.getElementById("projectName");
    let newProj = new Project(projName.value);
    Storage.storeProj(projName.value, newProj);
    // console.log(Storage.getProject(projName.value));
    MenuUI.createProjElement(newProj);
    projName.value = "";
  }

  static inboxButton() {
    const listDiv = document.getElementById("listDiv");
    const taskTitle = document.createElement("h3");
    MenuUI.removeActive();
    taskTitle.classList.add("task-title", "active");
    taskTitle.textContent = "DoIt! List";
    listDiv.innerHTML = "";
    listDiv.appendChild(taskTitle);
    let items = Storage.getTaskItems();
    items.forEach((el) => {
      let key = el.name;
      let value = new Date(el.dueDate);
      MenuUI.displayTasks("Task", key, value, "Tasks");
    });
  }
  static projectInbox() {
    const listDiv = document.getElementById("listDiv");
    const projTitle = document.createElement("h3");
    projTitle.classList.add("proj-title");
    projTitle.textContent = "Projects";
    MenuUI.removeActive();
    listDiv.innerHTML = "";
    listDiv.appendChild(projTitle);
    let items = Storage.getAllProj();
    items.forEach((el) => {
      let key = el.name;
      MenuUI.displayProjects("Proj", key);
    });
  }
  static createProjElement(el) {
    const listOfProjects = document.querySelector(".proj-list");
    const proj = document.createElement("button");
    const projectName = document.createElement("div");
    const deleteProj = document.createElement("button");
    proj.dataset.type = "Proj";
    proj.dataset.key = el.name;
    proj.setAttribute("id", el.name);
    projectName.textContent = el.name;
    projectName.dataset.type = "Proj";
    projectName.dataset.key = el.name;
    deleteProj.textContent = " X ";
    deleteProj.dataset.key = el.name;
    proj.addEventListener("click", this.projButton);
    deleteProj.addEventListener("click", MenuUI.removeProjBtn);
    proj.appendChild(projectName);
    
    listOfProjects.appendChild(proj);
    listOfProjects.appendChild(deleteProj);
  }
  static listProjects(name) {
    name.forEach((el) => {
      this.createProjElement(el);
    });
  }
  static projButton(e) {
    const proj = Storage.getProject(e.target.dataset.key);
    const listDiv = document.getElementById("listDiv");
    const projTitle = document.createElement("h3");
    const myInbox = document.querySelector(".myInbox");
    const addProjTaskBtn = document.createElement("button");
    addProjTaskBtn.classList.add("addProjTaskBtn");
    addProjTaskBtn.dataset.key = e.target.dataset.key;
    addProjTaskBtn.addEventListener("click", MenuUI.addProjTaskBtn);
    addProjTaskBtn.textContent = "+ Add Task";
    MenuUI.removeActive();
    listDiv.innerHTML = "";
    listDiv.classList.add("listDiv", "active");
    myInbox.classList.add("active");
    projTitle.classList.add("projTitle", "active");
    projTitle.textContent = e.target.dataset.key;
    listDiv.appendChild(projTitle);
    myInbox.appendChild(listDiv);
    MenuUI.listProjectList(proj);
    listDiv.appendChild(addProjTaskBtn);
  }
  static addProjTaskBtn(e) {
    const taskForm = document.getElementById("myProjForm");
    const submitTaskBtn = document.getElementById("submitProjTaskBtn");
    const addProjTaskBtn = document.querySelector(".addProjTaskBtn");
    addProjTaskBtn.classList.add("inactive");
    taskForm.classList.add("active");
    submitTaskBtn.classList.add("add-proj-task");
    const submitProjTaskBtn = document.querySelector(".add-proj-task");
    submitTaskBtn.dataset.key = e.target.dataset.key;
    submitProjTaskBtn.addEventListener("click", MenuUI.submitProjTaskBtn);
  }

  //finish after able to add tasks to projects
  static listProjectList(proj) {
    const listContainer = document.querySelector(".listDiv");
    proj.taskList.forEach((el) => {
      MenuUI.displayTasks("Proj", el[0], el[1], proj.name);
    });
  }
  static addProject() {
    const projects = document.getElementById("project-form");
    MenuUI.removeActive();
    projects.classList.add("active");
  }
  static displayTasks(type, key, value, projName) {
    const listContainer = document.querySelector("#listDiv");
    const myInbox = document.querySelector(".myInbox");
    const addProjTaskBtn = document.querySelector(".addProjTaskBtn");
    const myTask = document.createElement("div");
    const nameName = document.createElement("p");
    const name = document.createElement("input");
    const nameDiv = document.createElement("div");
    const dateDate = document.createElement("p");
    const date = document.createElement("input");
    const dateDiv = document.createElement("div");
    const delTask = document.createElement("button");
    name.setAttribute("type", "text");
    date.setAttribute("type", "date");  
    myInbox.classList.add("active");
    listContainer.classList.add("active");
    nameName.classList.add("name-el", "active");
    dateDate.classList.add("date-el", "active");
    name.classList.add("name-input");
    date.classList.add("date-input");
    delTask.classList.add("delTask", "active");
    myTask.classList.add("myTask", "active");
    if (type === "Proj") {
      myTask.dataset.type = type;
      myTask.dataset.key = projName;
      delTask.dataset.type = type;
      delTask.dataset.key = projName;
      //is this needed??
      delTask.dataset.task = `${projName + "-" + key}`;
    } else if (type === "Task") {
      myTask.dataset.type = type;
      myTask.dataset.key = key;
      delTask.dataset.type = type;
      delTask.dataset.key = key;
    }
    delTask.textContent = "X";
    let newDate = Storage.formatDate(value);
    console.log(newDate);
    nameName.textContent = key;
    name.setAttribute("value", key);
    name.dataset.key = key;
    nameName.dataset.key = key;
    date.dataset.key = key;
    dateDate.dataset.key = key;
    dateDate.textContent = newDate;
    nameDiv.appendChild(name);
    nameDiv.appendChild(nameName);
    dateDiv.appendChild(date);
    dateDiv.appendChild(dateDate);
    myTask.appendChild(nameDiv);
    myTask.appendChild(dateDiv);
    myTask.appendChild(delTask);
    listContainer.appendChild(myTask);
    myInbox.insertBefore(listContainer, addProjTaskBtn);
    nameName.addEventListener("click", MenuUI.editTaskName);
    name.addEventListener("blur", MenuUI.submitTaskNameFromEdit);
    dateDate.addEventListener("click", MenuUI.editTaskDate);
    date.addEventListener("blur", MenuUI.submitTaskDateFromEdit);
    if (type === "Task") {
      delTask.addEventListener("click", MenuUI.removeTaskBtn);
    } else if (type === "Proj") {
      delTask.addEventListener("click", MenuUI.removeProjTaskBtn); //update to remove proj task
    }
  }
  static editTaskName(e) {
    const nameInput = document.querySelector('.name-input[data-key="' + e.target.dataset.key + '"]');
    const nameP = document.querySelector('.name-el[data-key="' + e.target.dataset.key + '"]');
    nameP.classList.remove("active");
    nameInput.classList.add("active");
  }

  static editTaskDate(e) {
    const dateInput = document.querySelector('.date-input[data-key="' + e.target.dataset.key + '"]');
    const dateP = document.querySelector('.date-el[data-key="' + e.target.dataset.key + '"]');
    dateP.classList.remove("active");
    dateInput.classList.add("active");
  }

  static submitTaskDateFromEdit(e) {  
    const taskDiv = document.querySelector('[data-type="Task"][data-key="' + e.target.dataset.key + '"]');
    const dateInput = document.querySelector('.date-input[data-key="' + e.target.dataset.key + '"]');
    const dateP = document.querySelector('.date-el[data-key="' + e.target.dataset.key + '"]');
    dateP.classList.add("active");
    dateInput.classList.remove("active");
    const task = Storage.getTask(e.target.dataset.key);
    const newTask = new Task(task.name, dateInput.value);
    Storage.removeTask(e.target.dataset.key);
    Storage.storeTask(newTask.name, newTask);
    let newDate = new Date(newTask.dueDate);
    taskDiv.remove()
    MenuUI.displayTasks("Task", newTask.name, newDate, null);
  }
  static submitTaskNameFromEdit(e) {
    const taskDiv = document.querySelector('[data-type="Task"][data-key="' + e.target.dataset.key + '"]');
    const nameInput = document.querySelector('.name-input[data-key="' + e.target.dataset.key + '"]');
    const nameP = document.querySelector('.name-el[data-key="' + e.target.dataset.key + '"]');
    nameP.classList.add("active");
    nameInput.classList.remove("active");
    const task = Storage.getTask(e.target.dataset.key);
    console.log(task);
    const newTask = new Task(nameInput.value, task.dueDate);
    console.log(newTask.dueDate);
    Storage.removeTask(e.target.dataset.key);
    Storage.storeTask(newTask.name, newTask);
    let newDate = new Date(newTask.dueDate);
    taskDiv.remove();
    MenuUI.displayTasks("Task", newTask.name, newDate, "Tasks");
  }

  static displayProjects(type, key) {
    const listDiv = document.getElementById("listDiv");
    const myInbox = document.querySelector(".myInbox");
    const name = document.createElement("div");
    const delTask = document.createElement("button");
    const myTask = document.createElement("div");
    listDiv.classList.add("active");
    myInbox.classList.add("active");
    delTask.classList.add("delTask", "active");
    myTask.classList.add("myTask", "active");
    myTask.dataset.key = type + "-" + key;
    delTask.dataset.key = type + "-" + key;
    delTask.textContent = "X";
    delTask.addEventListener("click", MenuUI.removeTaskBtn);
    name.textContent = key;
    myTask.appendChild(name);
    myTask.appendChild(delTask);
    listDiv.appendChild(myTask);
  }
  static todayTasks() {
    const myInbox = document.querySelector(".myInbox");
    const listDiv = document.getElementById("listDiv");
    const taskTitle = document.createElement("h3");
    taskTitle.classList.add("task-title", "active");
    taskTitle.textContent = "DoIt! List";
    MenuUI.removeActive();
    myInbox.classList.add("active");
    listDiv.innerHTML = "";
    listDiv.appendChild(taskTitle);
    let items = Storage.getTaskItems();
    items.forEach((el) => {
      let key = el.name;
      let value = new Date(el.dueDate);
      if (isToday(value)) {
        MenuUI.displayTasks("Task", key, value);
      } else {
        return;
      }
    });
  }

  static weekTasks() {
    const myInbox = document.querySelector(".myInbox");
    const listDiv = document.getElementById("listDiv");
    const taskTitle = document.createElement("h3");
    taskTitle.classList.add("task-title", "active");
    taskTitle.textContent = "DoIt! List";
    MenuUI.removeActive();
    myInbox.classList.add("active");
    let today = new Date();
    listDiv.innerHTML = "";
    listDiv.appendChild(taskTitle);
    let items = Storage.getTaskItems();
    items.forEach((el) => {
      let key = el.name;
      let value = new Date(el.dueDate);
      if (isThisWeek(value, 0)) {
        MenuUI.displayTasks("Task", key, value);
      } else {
        return;
      }
    });
  }
  static removeActive() {
    const allActive = document.querySelectorAll(".active");
    allActive.forEach((item) => {
      item.classList.remove("active");
    });
  }
}
