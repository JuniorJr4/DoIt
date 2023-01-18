import Task from "./task";
import Storage from "./storage";
import { format, isBefore, isEqual, parseISO } from "date-fns";

export default class MenuUI {
  // static displayAddTask() {

  //   return taskForm;
  // }
  static addMenuButtons() {
    const taskBtn = document.getElementById("addTask");
    const taskSubmit = document.getElementById("submitBtn");
    const inboxBtn = document.getElementById("inbox");
    const todayBtn = document.getElementById("today");
    const thisWeekBtn = document.getElementById("thisWeek");
    const deleteTask = document.getElementById("clearTask");
    taskBtn.addEventListener("click", MenuUI.addTaskBtn);
    taskSubmit.addEventListener("click", MenuUI.submitTaskBtn);
    inboxBtn.addEventListener("click", MenuUI.inboxButton);
    deleteTask.addEventListener("click", MenuUI.clearStorageBtn);
    todayBtn.addEventListener("click", MenuUI.todayTasks);
    thisWeekBtn.addEventListener('click', MenuUI.weekTasks);
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
    let dueDate = document.getElementById("due").value;
    // const project = document.getElementById('project').value;
    // const priority = document.getElementById('priority').checked;
    let newTask = new Task(taskName.value, dueDate);
    Storage.storeTask(newTask);
    taskForm.classList.add("new-task");
    taskName.value = "";
    console.log(localStorage.getItem("task"));
  }

  static inboxButton() {
    const myInbox = document.querySelector(".myInbox");
    MenuUI.removeActive();
    // myInbox.classList.add("active");
    myInbox.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = JSON.parse(localStorage.getItem(key));
      MenuUI.displayTasks(key, value);
    }
  }
  static displayTasks(key, value) {
    const myInbox = document.querySelector(".myInbox");
    const myTask = document.createElement("div");
    const name = document.createElement("div");
    const date = document.createElement("div");
    const delTask = document.createElement("button");

    myInbox.classList.add("active");
    delTask.classList.add("delTask", "active");
    myTask.classList.add("myTask", "active");
    myTask.dataset.key = key;
    delTask.dataset.key = key;
    delTask.textContent = "X";
    myTask.addEventListener("click", MenuUI.removeTaskBtn);
    name.textContent = value.name;
    date.textContent = Storage.formatDate(value.dueDate);
    console.log(key, value);
    myTask.appendChild(name);
    myTask.appendChild(date);
    myTask.appendChild(delTask);
    myInbox.appendChild(myTask);
  }

  static todayTasks() {
    const myInbox = document.querySelector(".myInbox");
    MenuUI.removeActive();
    myInbox.classList.add("active");
    let today = new Date();
    myInbox.innerHTML = "";
    console.log(today);
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = JSON.parse(localStorage.getItem(key));
      let toCompare = new Date(value.dueDate);
      console.log(isBefore(toCompare, today));
      if (isBefore(toCompare, today)) {
        console.log("yes");
        MenuUI.displayTasks(key, value);
      } else {
        console.log("not working");
      }
    }
  }

  static weekTasks() {
    const myInbox = document.querySelector(".myInbox");
    MenuUI.removeActive();
    myInbox.classList.add("active");
    let today = new Date();
    let nextWeek = today.setDate(new Date().getDate() + 7);
    myInbox.innerHTML = "";
    console.log(today);
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = JSON.parse(localStorage.getItem(key));
      let toCompare = new Date(value.dueDate);
      console.log(isBefore(toCompare, nextWeek));
      if (isBefore(toCompare, nextWeek)) {
        console.log("yes");
        MenuUI.displayTasks(key, value);
      } else {
        console.log("not working");
      }
    }
  }
  static removeActive() {
    const allActive = document.querySelectorAll(".active");
    allActive.forEach((item) => {
      item.classList.remove("active");
    });
  }
}
