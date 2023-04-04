import { format, isValid, parse } from "date-fns";

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
    console.log(projToEdit);
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
    //dueDate = newTaskDate;
    projToEdit.taskList[subArrayIndexToEdit] = [name, dueDate];
    console.log(dueDate);
    Storage.removeProj(proj);
    Storage.storeProj(proj, projToEdit);
    //return projToEdit;
  }
  static editProjTaskDate(proj, taskName, newTaskDate) {
    let projToEdit = Storage.getProject(proj);
    let subArrayIndexToEdit = projToEdit.taskList.findIndex(
      (subArray) => subArray[0] === taskName
    );
    let [name, dueDate] = projToEdit.taskList[subArrayIndexToEdit];
    //name = newTaskName;
    dueDate = newTaskDate;
    projToEdit.taskList[subArrayIndexToEdit] = [name, dueDate];
    console.log(dueDate);
    Storage.removeProj(proj);
    Storage.storeProj(proj, projToEdit);
    //return projToEdit;
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
  static convertDateToISO(dateString) {
    const parts = dateString.split("/");
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    // Construct a new Date object using the day, month, and year components
    const dateObject = new Date(year, month - 1, day);

    // Use the toISOString() method to convert the Date object to ISO 8601 format
    const isoDateString = dateObject.toISOString();

    // Return the ISO 8601 date string
    console.log(isValid(isoDateString));
    return isoDateString;
  }
  static formatDate(date) {
    if (isValid(date)) {
      const formattedDate = format(date, "dd/MM/yyyy");
      return formattedDate;
    } else if (typeof date === "string") {
      const dateObject = parse(date, "dd/MM/yyyy", new Date());
      console.log(dateObject);
      if (isValid(dateObject)) {
        const formattedDate = format(dateObject, "dd/MM/yyyy");
        console.log(formattedDate);
        return formattedDate;
      } else {
        return "No Due Date";
      }
    }
  }
}
