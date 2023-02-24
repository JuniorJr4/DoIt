export default class Project {
  constructor(name) {
    this.name = name;
    this.taskList = [];
  }
  setName(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
  addTask(task) {
    this.taskList.push(task);
  }
  getTaskList() {
    return this.taskList;
  }
}
