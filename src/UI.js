import Task from "./task";
import Storage from "./storage";
import Project from "./projects";
import { format, isValid, isToday, isThisWeek } from "date-fns";

export default class MenuUI {
  static addMenuButtons() {
    const taskBtn = document.getElementById("addTask");
    const taskSubmit = document.getElementById("submitBtn");
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
    taskSubmit.addEventListener("click", MenuUI.submitTaskBtn);
    inboxBtn.addEventListener("click", MenuUI.inboxButton);
    deleteTask.addEventListener("click", MenuUI.clearStorageBtn);
    todayBtn.addEventListener("click", MenuUI.todayTasks);
    thisWeekBtn.addEventListener("click", MenuUI.weekTasks);
    addProject.addEventListener("click", this.addProject);
    Storage.getTaskItems();
    let projList = Storage.getAllProj();
    this.listProjects(projList);
    console.log(projList);
  }

  static addTaskBtn() {
    const taskForm = document.getElementById("myForm");
    MenuUI.removeActive();
    taskForm.classList.add("active");
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
  static submitTaskBtn() {
    const taskForm = document.getElementById("myForm");
    let taskName = document.getElementById("name");
    let dueDate = document.getElementById("due");
    let newTask = new Task(taskName.value, dueDate.value);
    console.log(window[taskName.value]);
    Storage.storeTask(taskName.value, newTask);
    // taskForm.classList.add("new-task");
    taskName.value = "";
    dueDate.value = "";
  }
  // need to fix this function to add new proj
  static submitProj() {
    let projName = document.getElementById("projectName");
    let newProj = new Project(projName.value);
    console.log(newProj.name);
    Storage.storeProj(projName.value, newProj);
    MenuUI.createProjElement(newProj);
    projName.value = "";
  }

  static inboxButton() {
    const myInbox = document.querySelector(".myInbox");
    MenuUI.removeActive();
    myInbox.innerHTML = "";
    let items = Storage.getTaskItems();
    console.log(items);
    items.forEach((el) => {
      let key = el.name;
      let value = new Date(el.dueDate);
      console.log(isValid(value));
      console.log(typeof value, value);
      MenuUI.displayTasks("Task", key, value);
    });
  }
  static projectInbox() {
    const myInbox = document.querySelector(".myInbox");
    MenuUI.removeActive();
    myInbox.innerHTML = "";
    let items = Storage.getAllProj();
    console.log(items);
    items.forEach((el) => {
      let key = el.name;
      console.log(key);
      MenuUI.displayProjects("Proj", key);
    });
  }
  static createProjElement(el) {
    const listOfProjects = document.querySelector(".proj-list");
    const proj = document.createElement("button");
    const projectName = document.createElement("div");
    const deleteProj = document.createElement("div");
    proj.dataset.key = el.name;
    projectName.textContent = el.name;
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
    const proj = JSON.parse(localStorage.getItem(e.target.dataset.key));
    console.log(proj, e.target.dataset.key);
    const myInbox = document.querySelector(".myInbox");
    const addProjTaskBtn = document.createElement("button");
    addProjTaskBtn.addEventListener("click", MenuUI.addProjTaskBtn);
    addProjTaskBtn.textContent = "+ Add Task";
    MenuUI.removeActive();
    myInbox.innerHTML = "";
    myInbox.classList.add("active");
    const projTitle = document.createElement("h3");
    //add task button first
    // const projectTasks = document.createElement("div");
    // proj.taskList.forEach((el) => {
    //   let key = el;
    // });
    projTitle.classList.add("projTitle", "active");
    projTitle.textContent = e.target.dataset.key;
    
    myInbox.appendChild(projTitle);
    myInbox.appendChild(addProjTaskBtn);
  }
  static addProjTaskBtn() {
    const taskForm = document.getElementById("myForm");
    taskForm.classList.add("active");
    console.log('yes');
  }

  //finish after able to add tasks to projects
  static listProjectList(proj) {
    proj.taskList.forEach((el) => {
      const taskName = document.createElement("div");
      const name = document.createElement("div");
      const date = document.createElement("div");
      const delTask = document.createElement("button");
    });
  }
  static addProject() {
    const projects = document.getElementById("project-form");
    MenuUI.removeActive();
    projects.classList.add("active");
  }
  static displayTasks(type, key, value) {
    if (type === "Task") {
      const myInbox = document.querySelector(".myInbox");
      const myTask = document.createElement("div");
      const name = document.createElement("div");
      const date = document.createElement("div");
      const delTask = document.createElement("button");
      myInbox.classList.add("active");
      delTask.classList.add("delTask", "active");
      myTask.classList.add("myTask", "active");
      myTask.dataset.key = type + "-" + key;
      delTask.dataset.key = type + "-" + key;
      delTask.textContent = "X";
      delTask.addEventListener("click", MenuUI.removeTaskBtn);
      console.log(isValid(value));
      console.log(typeof value, value);
      let newDate = Storage.formatDate(value);
      name.textContent = key;
      date.textContent = newDate;
      // console.log(key, value);
      myTask.appendChild(name);
      myTask.appendChild(date);
      myTask.appendChild(delTask);
      myInbox.appendChild(myTask);
    }
  }
  static addProjTask() {}
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
    MenuUI.removeActive();
    myInbox.classList.add("active");

    myInbox.innerHTML = "";
    let items = Storage.getTaskItems();
    console.log(typeof items);
    items.forEach((el) => {
      let key = el.name;
      let value = new Date(el.dueDate);
      if (isToday(value)) {
        console.log("yes");
        MenuUI.displayTasks("Task", key, value);
      } else {
        console.log("suck it");
      }
    });
  }

  static weekTasks() {
    const myInbox = document.querySelector(".myInbox");
    MenuUI.removeActive();
    myInbox.classList.add("active");
    let today = new Date();
    let nextWeek = today.setDate(new Date().getDate() + 7);
    myInbox.innerHTML = "";
    console.log(today);
    let items = Storage.getTaskItems();
    items.forEach((el) => {
      let key = el.name;
      let value = new Date(el.dueDate);
      if (isThisWeek(value, 0)) {
        console.log("yes");
        MenuUI.displayTasks("Task", key, value);
      } else {
        console.log("suck it");
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
