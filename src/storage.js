import { format, isValid, parseISO } from "date-fns";

export default class Storage {
  static storeTask(id, task) {
    let className = "Task";
    localStorage.setItem(className + "-" + id, JSON.stringify(task));
  }
  static getTask(id) {
    let className = "Task";
    let task = JSON.parse(localStorage.getItem(className + "-" + id));
    return task;
  }
  static removeTask(key) {
    localStorage.removeItem("Task-" + key);
  }
  static storeProj(id, proj) {
    let className = "Proj";
    localStorage.setItem(className + "-" + id, JSON.stringify(proj));
  }
  static getProject(id) {
    let className = "Proj";
    let proj = JSON.parse(localStorage.getItem(className + "-" + id));
    return proj;
  }
  static removeProj(key) {
    localStorage.removeItem("Proj-" + key);
  }
  static removeProjTask(proj, task) {
    let projToEdit = Storage.getProject(proj);
    // console.log(projToEdit);
    let indexToDelete;
    projToEdit.taskList.forEach((el, index) => {
      if (el[0] === task) {
        indexToDelete = index;
      }
    });
    projToEdit.taskList.splice(indexToDelete, 1);
    this.removeProj(proj);
    Storage.storeProj(proj, projToEdit);
  }
  static editProjTaskName(proj, taskName, newTaskName) {
    let projToEdit = Storage.getProject(proj);
    let subArrayIndexToEdit = projToEdit.taskList.findIndex(
      (subArray) => subArray[0] === taskName
    );
    let [name, dueDate] = projToEdit.taskList[subArrayIndexToEdit];
    name = newTaskName;
    projToEdit.taskList[subArrayIndexToEdit] = [name, dueDate];
    console.log(dueDate);
    Storage.removeProj(proj);
    Storage.storeProj(proj, projToEdit);
  }
  static editProjTaskDate(proj, taskName, newTaskDate) {
    let projToEdit = Storage.getProject(proj);
    let subArrayIndexToEdit = projToEdit.taskList.findIndex(
      (subArray) => subArray[0] === taskName
    );
    let [name, dueDate] = projToEdit.taskList[subArrayIndexToEdit];
    dueDate = newTaskDate;
    projToEdit.taskList[subArrayIndexToEdit] = [name, dueDate];
    Storage.removeProj(proj);
    Storage.storeProj(proj, projToEdit);
  }
  static getTaskItems() {
    let items = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("Task-")) {
        let value = JSON.parse(localStorage.getItem(key));
        items.push(value);
      }
    }
    console.log(items);
    return items;
  }
  static getAllProj() {
    let projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("Proj-")) {
        let proj = JSON.parse(localStorage.getItem(key));
        projects.push(proj);
      }
    }
    return projects;
  }
  static checkIfTaskExists(taskName) {
    return this.getTaskItems().some((task) => task.name === taskName);
  }
  static checkIfProjTaskExists(project, taskName) {
    return project.taskList.some(task => task[0] === taskName);
  }
  static formatDate(date) {
    // If input is a string, convert it to a Date object
    if (typeof date === "string") {
      date =new Date(date);
      console.log(date);
    }

    // Check if the input is a valid date object
    if (!isValid(date)) {
      return "No Due Date";
    }

    // Check if the date is already in the desired format
    const formattedDate = format(date, "dd/MM/yyyy");
    return formattedDate;
    
  }
}
