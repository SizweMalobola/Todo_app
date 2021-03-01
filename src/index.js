import Project from "./_Project";
import Task from "./_Task";
import View from "./_View";
import {
  formatDistance,
  isThisWeek,
  startOfToday,
  subDays,
  parseISO,
} from "date-fns";
import { format } from "date-fns/esm";

// ini root
new View(document.querySelector("#content"));

const controller = (function () {
  // render
  var projects = [];
  var currentProjectIndex;
  //! set global variables
  // left
  var leftDiv = document.querySelector("#left-div");
  // main btns
  var mainBtns = document.querySelector("#main-btns");
  var homeBtn = document.querySelector("#home-btn");
  var todayBtn = document.querySelector("#today-btn");
  var weekBtn = document.querySelector("#week-btn");
  // save project btn
  var saveBtn = document.querySelector("#save-project");
  // list for projects (Div)
  var listForProjects = document.querySelector("#list-for-projects");
  // right
  var rightDiv = document.querySelector("#right-div");
  // tasksDiv
  var tasksDiv = document.querySelector("#tasks-div");
  // lists for tasks
  var listForTasks = document.querySelector("#list-for-tasks");

  function ini() {
    // bind events
    bindEvents();
  }
  //! Bind Events
  function bindEvents() {
    // * onclick, check if target is classList == nav-link,if nav-link remove active class from active link, add active class to target
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

    // * all main btns clear Tasks div bottom
    mainBtns.addEventListener("click", function (e) {
      if (e.target.classList.contains("nav-link")) {
        clearTasksDivBottom();
      }
    });
    // * render all tasks in all projects
    homeBtn.addEventListener("click", function (e) {
      clearListForTasks();
      if (projects.length != 0) {
        for (let i = 0; i < projects.length; i++) {
          renderTasks(i);
        }
      }
    });
    // * onclick a project is created and stored in an array
    saveBtn.addEventListener("click", function (e) {
      if (document.querySelector("#project").value != "") {
        makeProject(document.querySelector("#project").value);
        document.querySelector("#project").value = "";
        renderProjects();
      }
    });
    // * a global variable that will keep track of my current project's index
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
        if (tasksDiv.lastElementChild.id != "task-div-bottom") {
          tasksDiv.append(createTaskDivBottom());
        }
        //*display project title
        let projectTitle = document.createElement("h1");
        projectTitle.id = "project-title";
        projectTitle.innerText = `${projects[currentProjectIndex].title}`;

        // TODO: add evenlistener to  save-task button,
        //* render tasks from tasks array inside project object instace
        clearListForTasks();
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
          tasksDiv.replaceChild(
            createTaskDivBottom(),
            tasksDiv.lastElementChild
          );
          clearListForTasks();
          renderTasks(currentProjectIndex);
        } else {
          alert("Title must be filled out");
        }
      }
    });
    // * tasks form cancel-task-btn
    tasksDiv.addEventListener("click", function (e) {
      if (e.target.id == "cancel") {
        tasksDiv.replaceChild(createTaskDivBottom(), tasksDiv.lastElementChild);
        clearListForTasks();
        renderTasks(currentProjectIndex);
      }
    });
    //* when add-task-btn is clicked, add-task-btn should disappear and its place task form should appear
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
        tasksDiv.replaceChild(taskForm, e.target.parentElement);
      }
    });
    //* delete task form project
    listForTasks.addEventListener("click", function (e) {
      if (e.target.classList.contains("task-delete")) {
        let taskIndex = e.target.parentElement.parentElement.getAttribute(
          "data-task-index"
        );
        let projectIndex = e.target.parentElement.parentElement.getAttribute(
          "data-project-index"
        );
        projects[projectIndex].removeTask(taskIndex);
        if (tasksDiv.lastElementChild.id != "list-for-tasks") {
          clearListForTasks();
          renderTasks(projectIndex);
        } else {
          // refresh home
          clearListForTasks();
          for (let i = 0; i < projects.length; i++) {
            renderTasks(i);
          }
        }
      }
    });
    // * delete project
    listForProjects.addEventListener("click", function (e) {
      if (e.target.classList.contains("project-delete")) {
        let projectIndex = e.target.parentElement.parentElement.getAttribute(
          "data-project-index"
        );
        projects.splice(projectIndex, 1);
        clearListForTasks();
        clearTasksDivBottom();
        renderProjects();
      }
    });
    // * toggle task.complete value
    listForTasks.addEventListener("click", function (e) {
      if (e.target.classList.contains("task-complete")) {
        let projectIndex = e.target.parentElement.getAttribute(
          "data-project-index"
        );
        let taskIndex = e.target.parentElement.getAttribute("data-task-index");
        let task = projects[projectIndex].tasks[taskIndex];
        task.toggleComplete();
        if (task.complete) {
          e.target.parentElement.classList.toggle("complete", true);
        } else {
          e.target.parentElement.classList.toggle("complete", false);
        }
      }
    });
    // * clear completed tasks
    // ! fix
    tasksDiv.addEventListener("click", function (e) {
      if (e.target.id == "clear-completed-tasks") {
        let tasksArray = projects[currentProjectIndex].tasks;
        tasksArray.forEach(function (task, index) {
          console.log(index);
          if (task.complete) {
            projects[currentProjectIndex].removeTask(index);
          }
        });
        clearListForTasks();
        renderTasks(currentProjectIndex);
      }
    });
    //*   today
    // ! not finished
    // TODO 1.get date of the current day(dd/mm/yy) 2.loop through every task of every project and render tasks that are only equal to today's date.
    todayBtn.addEventListener("click", function (e) {
      clearListForTasks();
      let today = format(new Date(), "yyyy-MM-dd");
      if (projects.length != 0) {
        for (let i = 0; i <= projects.length - 1; i++) {
          for (let j = 0; j <= projects[i].tasks.length - 1; j++) {
            console.log(`${projects[i].tasks[j].dueDate} -- ${today}`);
            if (projects[i].tasks[j].dueDate == today) {
              let taskObj = projects[i].tasks[j];
              let task = document.createElement("div");
              task.classList.add("task", "row", "container-fluid");
              task.innerHTML = `
            <input class="col-sm-1 task-complete" type="checkbox">
             <p class="col-sm-3 task-title" >${taskObj.title} ${taskObj.dueDate}</p>
             <span class="col-sm-6 task-description">${taskObj.description}</span>
             <div class="col-sm-2 d-flex justify-content-between"><button class="btn btn-sm btn-dark task-edit"><i class="far fa-edit"></i></button><button class="btn btn-sm btn-danger task-delete"><i class="fas fa-trash-alt"></i></button></div>
        `;

              task.setAttribute("data-task-index", j);
              task.setAttribute("data-project-index", i);
              listForTasks.appendChild(task);
              if (taskObj.complete) {
                task.classList.toggle("complete", true);
              } else {
                task.classList.toggle("complete", false);
              }
              let complete = document.querySelectorAll(".complete");
              complete.forEach((item) => {
                item.firstElementChild.checked = "true";
              });
            }
          }
        }
      }
    });

    // *week
    weekBtn.addEventListener("click", function (e) {
      clearListForTasks();
      if (projects.length != 0) {
        for (let i = 0; i <= projects.length - 1; i++) {
          for (let j = 0; j <= projects[i].tasks.length - 1; j++) {
            if (isThisWeek(parseISO(projects[i].tasks[j].dueDate))) {
              let taskObj = projects[i].tasks[j];
              let task = document.createElement("div");
              task.classList.add("task", "row", "container-fluid");
              task.innerHTML = `
            <input class="col-sm-1 task-complete" type="checkbox">
             <p class="col-sm-3 task-title" >${taskObj.title} ${taskObj.dueDate}</p>
             <span class="col-sm-6 task-description">${taskObj.description}</span>
             <div class="col-sm-2 d-flex justify-content-between"><button class="btn btn-sm btn-dark task-edit"><i class="far fa-edit"></i></button><button class="btn btn-sm btn-danger task-delete"><i class="fas fa-trash-alt"></i></button></div>
        `;

              task.setAttribute("data-task-index", j);
              task.setAttribute("data-project-index", i);
              listForTasks.appendChild(task);
              if (taskObj.complete) {
                task.classList.toggle("complete", true);
              } else {
                task.classList.toggle("complete", false);
              }
              let complete = document.querySelectorAll(".complete");
              complete.forEach((item) => {
                item.firstElementChild.checked = "true";
              });
            }
          }
        }
      }
    });
    //TODO : edit btn, responsive design
  }
  //! clearTasksDivBottom
  function clearTasksDivBottom() {
    if (tasksDiv.lastElementChild.id != "list-for-tasks") {
      tasksDiv.lastElementChild.remove();
    }
  }
  // ! makeProject
  function makeProject(title) {
    projects.push(new Project(title));
  }
  // !makeTask function
  function makeTask(index, title, description = "", date = "no date") {
    projects[index].addTask(new Task(title, description, date));
  }
  //! will render only when project list item is clicked
  function clearListForTasks() {
    //* remove elments that might have been in the projects unordered list
    while (listForTasks.childElementCount > 0) {
      listForTasks.lastChild.remove();
    }
  }
  // ! create task div bottom
  function createTaskDivBottom() {
    let taskDivBottom = document.createElement("div");
    taskDivBottom.id = "task-div-bottom";
    taskDivBottom.classList.add("row", "container-fluid");
    taskDivBottom.innerHTML = `
      <button id="add-task-btn" class="btn btn-light">+ Add Task</button><button id="clear-completed-tasks" class="btn btn-danger">Clear Completed Tasks</button>
    `;
    return taskDivBottom;
  }
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
      listItem.innerHTML = `<a class="nav-link project-item" href="#"><span><i class="fas fa-tasks"></i> ${project.title}</span><i class="far fa-times-circle project-delete"></i></a>`;
      listItem.setAttribute("data-project-index", index);
      listForProjects.appendChild(listItem);
    });
  }
  // ! render tasks
  function renderTasks(pIndex) {
    //* create li that will be appended to projects unordered list
    //! li should look like this <li data-index="should match same index as projects array">project-title</li>
    var tasksArray = projects[pIndex].tasks;
    //* adds tasks to list if tasks array is not empty, else a list item "no tasks" is added to task list
    if (tasksArray.length != 0) {
      tasksArray.forEach((taskObj, index) => {
        let task = document.createElement("div");
        task.classList.add("task", "row", "container-fluid");
        task.innerHTML = `
            <input class="col-sm-1 task-complete" type="checkbox">
             <p class="col-sm-3 task-title" >${taskObj.title} ${taskObj.dueDate}</p>
             <span class="col-sm-6 task-description">${taskObj.description}</span>
             <div class="col-sm-2 d-flex justify-content-between"><button class="btn btn-sm btn-dark task-edit"><i class="far fa-edit"></i></button><button class="btn btn-sm btn-danger task-delete"><i class="fas fa-trash-alt"></i></button></div>
        `;

        task.setAttribute("data-task-index", index);
        task.setAttribute("data-project-index", pIndex);
        listForTasks.appendChild(task);
        if (taskObj.complete) {
          task.classList.toggle("complete", true);
        } else {
          task.classList.toggle("complete", false);
        }
      });
      // makes sure that checked elements are persistent
      let complete = document.querySelectorAll(".complete");
      complete.forEach((item) => {
        item.firstElementChild.checked = "true";
      });
    }
  }
  //  //
  ini();
})();
