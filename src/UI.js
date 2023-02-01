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
    const projSubmit = document.getElementById('projSubmit');
    projects.addEventListener('click', this.projectInbox)
    projSubmit.addEventListener('click', MenuUI.submitProj)
    taskBtn.addEventListener("click", MenuUI.addTaskBtn);
    taskSubmit.addEventListener("click", MenuUI.submitTaskBtn);
    inboxBtn.addEventListener("click", MenuUI.inboxButton);
    deleteTask.addEventListener("click", MenuUI.clearStorageBtn);
    todayBtn.addEventListener("click", MenuUI.todayTasks);
    thisWeekBtn.addEventListener("click", MenuUI.weekTasks);
    addProject.addEventListener("click", this.addProject);
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
    console.log(typeof dueDate.value, dueDate.value);
    Storage.storeTask(taskName.value, newTask);
    // taskForm.classList.add("new-task");
    taskName.value = "";
    dueDate.value = "";
  }

  static submitProj() {
    let projName = document.getElementById("projectName");
    let newProj = new Project(projName.value);
    console.log(newProj);
    Storage.storeProj(projName.value, newProj);
    projName.value = "";
  }

  static inboxButton() {
    const myInbox = document.querySelector(".myInbox");
    MenuUI.removeActive();
    myInbox.innerHTML = "";
    let items = Storage.getTaskItems();
    console.log(items);
    // let taskItems = Object.entries(items);
    // let filterItems = taskItems.filter(([key, value]) => key.startsWith("Task-"));
    // const filtered = Object.fromEntries(filterItems);
    // console.log(filtered);
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
  static displayProjects(type, key) {
    const myInbox = document.querySelector(".myInbox");
    const name = document.createElement("div");
    const delTask = document.createElement("button");
    const myTask = document.createElement("div");
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
