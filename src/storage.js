import { format, parseISO } from "date-fns";

export default class Storage {
  static storeTask(id, task) {
    localStorage.setItem(id, JSON.stringify(task));
  }
  static removeTask(key) {
    localStorage.removeItem(key);
  }
  static getAllItems() {
    let items = []
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      console.log(key);
      let value = JSON.parse(localStorage.getItem(key));
      items.push(value);
    }
    // console.log(items);
    return items;
  }
  static formatDate(date) {
    if (date !== "") {
      const formattedDate = format(new Date(date), "dd/MM/yyyy");
      return formattedDate;
    } else {
      return "No Due Date";
    }
  }
}
