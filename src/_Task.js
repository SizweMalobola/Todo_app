export default class Task {
  constructor(title, description, dueDate) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.complete = false;
  }
  toggleComplete() {
    this.complete = this.complete == false ? true : false;
  }
}
