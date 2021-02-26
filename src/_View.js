export default class View {
  constructor(root) {
    this.root = root;
    this.root.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark"><a class="navbar-brand" href="#"><i class="fas fa-clipboard-list"></i> Todo List</a></nav>
          <div class="container-fluid row">
          <div id="left-div" class="col-sm-2 bg-light">
            <ul id="main-btns" class="nav nav-pills flex-column">
              <li class="nav-item">
              <a id="home-btn" class="nav-link active" aria-current="page" href="#"><i class="fas fa-home"></i> Home</a>
              </li>
              <li class="nav-item">
              <a id="today-btn" class="nav-link" href="#"><i class="fas fa-calendar-day"></i> Today</a>
              </li>
              <li class="nav-item">
              <a id="week-btn
              " class="nav-link" href="#"><i class="fas fa-calendar-week"></i> Week</a>
              </li>
            </ul>
            <div>
              <h3 class="display-6 my-3">Projects</h3>
                  <div id="add-project-div" class="d-flex mb-4">
                  <input id="project" type="text" class="form-control ps-1" placeholder="+ add project">
                  <button id="save-project" type="button" class="btn btn-dark">Save</button>
                  </div>
              <ul id="list-for-projects" class="nav nav-pills flex-column">
              </ul>
            </div>
          </div>
          <div id="right-div" class="col-sm-10">
          <div id="tasks-div">
            <div id="list-for-tasks">
            </div>
          </div>
          </div>
        </div>`;
  }
}
