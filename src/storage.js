import { format, isValid } from "date-fns";

export default class Storage {
  static storeTask(id, task) {
    let className = "Task";
    localStorage.setItem(className + "-" + id, JSON.stringify(task));
  }
  static removeTask(key) {
    localStorage.removeItem(key);
  }
  static storeProj(id, proj) {
    let className = "Proj";
    localStorage.setItem(className + "-" + id, JSON.stringify(proj));
  }
  static getTaskItems() {
    let items = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("Task-")) {
        console.log(key);
        let value = JSON.parse(localStorage.getItem(key));
        console.log(isValid(new Date(value.dueDate)));
        items.push(value);
      }
    }
    // console.log(items);
    return items;
  }
  static getAllProj() {
    let items = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("Proj-")) {
        console.log(key);
        let value = JSON.parse(localStorage.getItem(key));
        console.log(isValid(new Date(value.dueDate)));
        items.push(value);
      }
    }
    // console.log(items);
    return items;
  }
  static formatDate(date) {
    if (isValid(date)) {
      const formattedDate = format(date, "dd/MM/yyyy");
      return formattedDate;
    } else {
      return "No Due Date";
    }
  }
}
