import Project from "./_Project";
import Task from "./_Task";
var content = document.querySelector("#content");
var projects = [];

//? render function, displays inputfield and save button --that will be used to input and saving projects(by title) to global projects array;
function render() {
  content.innerHTML = `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark"><a class="navbar-brand" href="#"><i class="fas fa-clipboard-list"></i> Todo List</a></nav>
  <div class="container-fluid row">
  <div id="left-div" class="col-sm-2 bg-light">
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="#"><i class="fas fa-home"></i> Home</a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#"><i class="fas fa-calendar-day"></i> Today</a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#"><i class="fas fa-calendar-week"></i> Week</a>
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
      <table class="table table-hover">
        <thead>
          <tr>
          <th id="project-title" scope="col">Title</th>
          <th scope="col">Due Date</th>
          <th scope="col">Complete</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
          </tr>
        </thead>
      </table>
   </div> 
  </div>
</div>`;
}

render();

//?  makeProject function --is for storing projects inside a projects array
function makeProject(title) {
  projects.push(new Project(title));
}
//? makeTask function
function makeTask(index, title, description = "", date = "no date") {
  projects[index].addTask(new Task(title, description, date));
  console.log(projects[index].tasks);
}
//?
// function validateForm() {
//   var val = document.querySelector("#task-title");
//   if (val == "") {

//     return false;
//   }
// }
//! DOM Stuff
// onclick a project is created and stored in an array

var saveBtn = document.querySelector("#save-project");
saveBtn.addEventListener("click", function (e) {
  if (document.querySelector("#project").value != "") {
    makeProject(document.querySelector("#project").value);
    document.querySelector("#project").value = "";
    renderProjects();
  }
});

//TODO: render projects array items(if array is not empty) in a unordered list
//! will render only when saveBtn is pressed(successfuly)
function renderProjects() {
  //* remove elments that might have been in the projects unordered list
  var listForProjects = document.querySelector("#list-for-projects");
  while (listForProjects.childElementCount > 0) {
    listForProjects.lastChild.remove();
  }

  //* create li that will be appended to projects unordered list
  //! li should look like this <li data-index="should match same index as projects array">project-title</li>
  projects.forEach((project, index) => {
    let listItem = document.createElement("li");
    listItem.classList.add("nav-item");
    listItem.innerHTML = `<a class="nav-link project-item" href="#"><i class="fas fa-tasks"></i> ${project.title}</a>`;
    listItem.setAttribute("data-project-index", index);
    listForProjects.appendChild(listItem);
  });
}

//TODO: render tasks array items(if array is not empty) in a unordered list
//! will render only when project list item is clicked
var tableData = document.querySelector("table");
function renderTasks(index) {
  //* remove elments that might have been in the projects unordered list
  while (tableData.childElementCount > 1) {
    tableData.lastChild.remove();
  }
  //* create li that will be appended to projects unordered list
  //! li should look like this <li data-index="should match same index as projects array">project-title</li>
  var tasksArray = projects[index].tasks;
  //* adds tasks to list if tasks array is not empty, else a list item "no tasks" is added to task list
  if (tasksArray.length != 0) {
    tasksArray.forEach((task, index) => {
      let tr = document.createElement("tbody");
      tr.innerHTML = `
      <tr>
      <th class="task-title" scope="row"><span>${task.title}</span></th>
      <td class="task-duedate">${task.dueDate}</td>
      <td class="task-complete"><button class="comp-btn btn"><i class="fas fa-check"></i></button></td>
      <td class="task-edit"><button class="edit-btn btn"><i class="far fa-edit"></i></button></td>
      <td class="task-delete"><button class="del-btn btn"><i class="fas fa-trash-alt"></i></button></td></tr>`;
      tr.setAttribute("data-task-index", index);
      tableData.appendChild(tr);
    });
  }
}

// onclick display tasks
var listForProjects = document.querySelector("#list-for-projects");
var tasksDiv = document.querySelector("#tasks-div");
// ! a global variable that will keep track of my current project's index
var currentProjectIndex;
listForProjects.addEventListener("click", function (e) {
  if (e.target.classList.contains("project-item")) {
    currentProjectIndex = e.target.parentElement.getAttribute(
      "data-project-index"
    );
    // *remove task form
    if (tasksDiv.lastElementChild.nodeName == "FORM") {
      tasksDiv.lastElementChild.remove();
    }
    //* create a input field and a save btn for saving tasks in a project
    if (tasksDiv.lastElementChild.id != "add-task-btn") {
      let addTaskBtn = document.createElement("button");
      addTaskBtn.id = "add-task-btn";
      addTaskBtn.classList.add("btn", "btn-light");
      addTaskBtn.innerText = "+ Add Task";
      tasksDiv.append(addTaskBtn);
    }
    //*display project title when project item is clicked
    document.querySelector(
      "#project-title"
    ).innerText = `${projects[currentProjectIndex].title}`;

    // TODO: add evenlistener to  save-task button,
    //* render tasks from tasks array inside project object instace
    renderTasks(currentProjectIndex);
  }
});
//* tasks form save-task-btn
tasksDiv.addEventListener("click", function (e) {
  if (e.target.id == "save-task") {
    if (document.querySelector("#task-title").value != "") {
      makeTask(
        currentProjectIndex,
        document.querySelector("#task-title").value,
        document.querySelector("#task-description").value,
        document.querySelector("#task-duedate").value
      );
      //! replace task form with add task btn
      let addTaskBtn = document.createElement("button");
      addTaskBtn.id = "add-task-btn";
      addTaskBtn.classList.add("btn", "btn-light");
      addTaskBtn.innerText = "+ Add Task";
      tasksDiv.replaceChild(addTaskBtn, tasksDiv.lastElementChild);
      renderTasks(currentProjectIndex);
    } else {
      alert("Title must be filled out");
    }
  }
});
//* tasks form cancel-task-btn
tasksDiv.addEventListener("click", function (e) {
  if (e.target.id == "cancel") {
    let addTaskBtn = document.createElement("button");
    addTaskBtn.id = "add-task-btn";
    addTaskBtn.classList.add("btn", "btn-light");
    addTaskBtn.innerText = "+ Add Task";
    tasksDiv.replaceChild(addTaskBtn, tasksDiv.lastElementChild);
    renderTasks(currentProjectIndex);
  }
});

//TODO when element with a class containing navlink is clicked it must be active

// * onclick, check if target is classList == nav-link,if nav-link remove active class from active link, add active class to target
var leftDiv = document.querySelector("#left-div");
leftDiv.addEventListener("click", function (e) {
  if (e.target.classList.contains("nav-link")) {
    let navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((element) => {
      if (element.classList.contains("active")) {
        element.classList.remove("active");
      }
    });
    e.target.classList.add("active");
  }
});

//TODO when add-task-btn is clicked, add-task-btn should disappear and its place task form should appear
var rightDiv = document.querySelector("#right-div");
rightDiv.addEventListener("click", function (e) {
  if (e.target.id == "add-task-btn") {
    let taskForm = document.createElement("form");
    taskForm.setAttribute("submit", "return false");
    taskForm.innerHTML = `
          <div id="form-main" class="row">
            <input id="task-title" type="text" class="col-sm-12 form-control mb-2" placeholder="Title">
            <textarea id="task-description" class="col-sm-12 form-control mb-2" rows="3" placeholder="Description"></textarea>
                  <input id="task-duedate" type="date" class="col-sm-4" autocomplete="off"> <span class="my-auto col-sm-8">${projects[currentProjectIndex].title}</span>
          </div>
          <div id="form-footer" class="row mt-2">
            <button id="save-task" type="submit" class="col btn btn-primary">save</button> <button id="cancel" class="col btn btn-danger">cancel</button>
          </div>
    `;
    e.target.parentElement.replaceChild(taskForm, e.target);
  }
});
