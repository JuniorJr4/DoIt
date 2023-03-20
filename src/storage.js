import { format, isValid } from "date-fns";

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
  static formatDate(date) {
    console.log(isValid(date));
    if (isValid(date)) {
      const formattedDate = format(date, "dd/MM/yyyy");
      return formattedDate;
    } else {
      return "No Due Date";
    }
  }
}
