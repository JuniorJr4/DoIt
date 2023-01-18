import { format, parseISO } from "date-fns";

export default class Storage {
  static storeTask(task) {
    localStorage.setItem(localStorage.length + 1, JSON.stringify(task));
  }
  static removeTask(key) {
    localStorage.removeItem(key);
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
