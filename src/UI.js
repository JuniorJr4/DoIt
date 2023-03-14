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
    const delTask = document.querySelector(
      `[data-key="${e.target.dataset.key}"]`
    );
    const myTask = document.querySelector(
      `[data-key="${e.target.dataset.key}"]`
    );
    localStorage.removeItem(e.target.dataset.key);
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
    MenuUI.removeActive();
    listDiv.innerHTML = "";
    let items = Storage.getTaskItems();
    items.forEach((el) => {
      let key = el.name;
      let value = new Date(el.dueDate);
      MenuUI.displayTasks("Task", key, value, "Tasks");
    });
  }
  static projectInbox() {
    const listDiv = document.getElementById("listDiv");
    MenuUI.removeActive();
    listDiv.innerHTML = "";
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
    const deleteProj = document.createElement("div");
    proj.dataset.type = "Proj";
    proj.dataset.key = el.name;
    projectName.textContent = el.name;
    projectName.dataset.type = "Proj";
    projectName.dataset.key = el.name;
    deleteProj.textContent = "X";
    proj.addEventListener("click", this.projButton);
    proj.appendChild(projectName);
    proj.appendChild(deleteProj);
    listOfProjects.appendChild(proj);
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
    const name = document.createElement("div");
    const date = document.createElement("div");
    const delTask = document.createElement("button");
    myInbox.classList.add("active");
    listContainer.classList.add("active");
    delTask.classList.add("delTask", "active");
    myTask.classList.add("myTask", "active");
    if (type === "Proj") {
      myTask.dataset.type = type;
      myTask.dataset.key = projName;
      delTask.dataset.type = type;
      delTask.dataset.key = projName;
      delTask.dataset.task = `${projName + "-" + key}`;
    } else if (type === "Task") {
      myTask.dataset.type = type;
      myTask.dataset.key = key;
      delTask.dataset.type = type;
      delTask.dataset.key = key;
    }
    delTask.textContent = "X";
    let newDate = Storage.formatDate(value);
    name.textContent = key;
    date.textContent = newDate;
    myTask.appendChild(name);
    myTask.appendChild(date);
    myTask.appendChild(delTask);
    listContainer.appendChild(myTask);
    myInbox.insertBefore(listContainer, addProjTaskBtn);
    if (type === "Task") {
      delTask.addEventListener("click", MenuUI.removeTaskBtn);
    } else if (type === "Proj") {
      delTask.addEventListener("click", MenuUI.removeProjTaskBtn); //update to remove proj task
    }
  }

  static displayProjects(type, key) {
    const myInbox = document.querySelector(".myInbox");
    const projTitle = document.createElement("h3");
    const name = document.createElement("div");
    const delTask = document.createElement("button");
    const myTask = document.createElement("div");
    projTitle.classList.add("proj-title");
    projTitle.textContent = "Projects";
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
    myInbox.appendChild(projTitle);
    myInbox.appendChild(myTask);
  }
  static todayTasks() {
    const myInbox = document.querySelector(".myInbox");
    const listDiv = document.getElementById("listDiv");
    MenuUI.removeActive();
    myInbox.classList.add("active");
    listDiv.innerHTML = "";
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
    MenuUI.removeActive();
    myInbox.classList.add("active");
    let today = new Date();
    listDiv.innerHTML = "";
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
