export default class Project {
  constructor(title) {
    this.title = title;
    this.tasks = [];
  }
  addTask(task) {
    this.tasks.push(task);
  }
  removeTask(taskIndex) {
    this.tasks.splice(taskIndex, 1);
  }
  //   editTask(task,taskIndex){
  //     this.tasks.splice(taskIndex,1,task)
  //   }
}
