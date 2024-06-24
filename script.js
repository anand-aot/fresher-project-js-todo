document.addEventListener('DOMContentLoaded', (event) => {
    displayTasks();
    document.getElementById('sortSelect').addEventListener('change', displayTasks);
  });
 
  
  function createTask() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const dueDate = document.getElementById('date').value;
    const completed = false;
    const todaydate = new Date().toISOString().split('T')[0];

    if (title === '' ||  dueDate === '') {
      alert('title and duedate field Required');
      return;
    }
    if(dueDate < todaydate){
      alert('Date entered not be less than today*s date');
      return;
    }
  
    const task = {
      title: title,
      description: description,
      dueDate: dueDate,
      status: completed
    };
  
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    clearFormFields();
    $('#modal-display').modal('hide');
    displayTasks();
  }
  
  function clearFormFields() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
  }
  
  function formatDate(dateStr) {
    var date = new Date(dateStr);
    var day = date.getDate();
    var month = date.toLocaleString('default', { month: 'short' });
    var year = date.getFullYear();
    return `${day+1} ${month} ${year}`;
  }

  function updateTaskStyles(task, index) {
    const today = new Date().toISOString().split('T')[0];
    let imgSource = "calendar.svg";
    if (task.dueDate < today) {
      imgSource = "red_calendar.png";
    }
    return imgSource;
  }

  function displayTasks() {
    const taskContainer = document.getElementById('task-container');
    const taskcomplete = document.getElementById('completed-container');
    taskcomplete.innerHTML = ''
    taskContainer.innerHTML = '';
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var sortOption = document.getElementById('sortSelect').value;
    console.log(sortOption);
    let event = tasks;
      if (sortOption === 'newest') {
        event.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
        localStorage.setItem('tasks',JSON.stringify(event));
      } else {
        event.sort((a,b) => new Date(b.dueDate) - new Date(a.dueDate));
        localStorage.setItem('tasks',JSON.stringify(event));
      }

      let searchValue = document.getElementById('searchInput').value.toLowerCase();
      let filteredTasks = event.filter(i => i.title.toLowerCase().includes(searchValue));
  
      filteredTasks.forEach(function(task, index) {
      let styleforspan = "";
      const taskDiv = document.createElement('div');
      const thisday = new Date().toISOString().split('T')[0];
      var formattedDueDate = formatDate(task.dueDate);
      if (task.dueDate < thisday) {
        styleforspan = "color: #C03503; background-color:#C035030F; border: 1px solid #C035030F;"
      }
      if(task.status == false){
            taskDiv.className = 'task';
            taskDiv.innerHTML = `
            <div class="item-straight">
            <div class="radio-div">
                <input type="radio" id="verify" onclick="taskCompleted(${index})">
            </div>
            <div class="space-content">
            <div class="task-cont task-cont-${index}">
                <div class="dot-flex"><h4>${task.title}</h4><div class="dot-color"></div></div>
                <p>${task.description}</p>
                <span style="${styleforspan}"><img src="image/${updateTaskStyles(task, index)}" > by  ${formattedDueDate} </span>
            </div>
            <div class="svg-image">
                <button type="button" class="pen-display" data-toggle="modal" data-target="#edittask-modal" onclick="editTask(${index})"><img src="image/pen.svg" alt="pen"></button>
            <button type="button"  data-toggle="modal" data-target="#deletetask-modal" onclick="deleteTask(${index})"><img src="image/delete.svg" alt="delete"></button>
            </div>
            </div>
            </div>
            `;

            taskContainer.appendChild(taskDiv);
    } else {
        taskDiv.className = 'task-done';
        taskDiv.innerHTML = `
        <div class="item-straight">
         <img src="image/done.svg" alt="done" onclick="taskRevert(${index})">
        <div class="space-content">
        <div class="task-cont">
            <div class="dot-flex"><h4>${task.title}</h4><div class="dot-color-success"></div></div>
            <p>${task.description}</p>
            <span><img src="image/calendar.svg" > by  ${formattedDueDate} </span>
        </div>
        <div class="svg-image">
            <button type="button"  data-toggle="modal" data-target="#edittask-modal" onclick="editTask(${index})"><img src="image/pen.svg" alt="pen"></button>
            <button type="button"  data-toggle="modal" data-target="#deletetask-modal" onclick="deleteTask(${index})"><img src="image/delete.svg" alt="delete"></button>
        </div>
        </div>
        </div>
        `;

        taskcomplete.appendChild(taskDiv);
    }
  });
  }
  
function taskCompleted(index){
    const alltasks = JSON.parse(localStorage.getItem('tasks')) || [];
    alltasks[index].status = true ;
    localStorage.setItem('tasks', JSON.stringify(alltasks));
    window.location.reload();
}

function taskRevert(index){
  const alltasks = JSON.parse(localStorage.getItem('tasks')) || [];
    alltasks[index].status = false ;
    localStorage.setItem('tasks', JSON.stringify(alltasks));
    window.location.reload();
}

function editTask(index){
  let alltasks = JSON.parse(localStorage.getItem('tasks'));
    const edit = alltasks[index]
    editDiv.innerHTML = `
    <div class="modal" id="edittask-modal">
          <div class="modal-dialog">
              <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                  <h4 class="modal-title">Add Task</h4>
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <!-- Modal body -->
                <div class="modal-body">
                  <div class="label">
                  <h4>Title *</h4>
                  <input type="text" id="nameupdate" class="name" value="${edit.title}">
                  </div>
                  <div class="label">
                    <h4>Description <img src="./image/Help outline.png" alt=""></h4>
                  <input type="text" class="description" style="width: 574px;height: 108px;" id="description_new" value="${edit.description}">
                  </div>
                  <div class="label"><h4>Due Date</h4>
                  <input type="date" name="date" id="date_new" value="${edit.dueDate}">
                  </div>
                </div>
                <!-- Modal footer -->
                <div class="modal-footer">
                  <button type="button" class="btn cancel-task-btn" class="close" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary add-task-btn add-btn" onclick="updateTask(${index})">Update</button>
                </div>
                
              </div>
            </div>
      </div>
    `
}

function  updateTask(index){
  const newtitle = document.getElementById('nameupdate').value.trim();
  const newdescription = document.getElementById('description_new').value.trim();
  const newdueDate = document.getElementById('date_new').value;
  const todaydate = new Date().toISOString().split('T')[0];
  
  if (newtitle === '' ||  newdueDate === '') {
    alert('title and duedate field Required');
    return;
  }

  if(newdueDate < todaydate){
    alert('Date entered not be less than today*s date');
    return;
}

  const task = {
    title: newtitle,
    description: newdescription,
    dueDate: newdueDate,
    status: false
  };
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index] = task;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  window.location.reload();
  $('#edittask-modal').modal('hide');
  alert('Task updated successfully');
}


function deleteTask(index){
  deleteDiv.innerHTML = `
    <div class="modal" id="deletetask-modal">
          <div class="modal-dialog-delete">
              <div class="modal-content-delete">
                <!-- Modal Header -->
                <div class="modal-header-delete">
                <div class="cross"><img src="image/cross.svg" data-dismiss="modal"></div>
                  <h4 class="modal-title-delete">Delete Task ?</h4>
                </div>
                <!-- Modal body -->
                <div class="modal-body-delete">
                  <h3>Are you sure you want to delete this task?</h3>
                </div>
                <!-- Modal footer -->
                <div class="modal-footer-delete">
                  <button type="button" class="btn cancel-task-btn" class="close" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-danger del-task-btn " onclick="deletePermission(${index})">Delete</button>
                </div>
                
              </div>
            </div>
      </div>
      `
}

function deletePermission(index){
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  window.location.reload();
}

function clearAlltask(){
  const alltasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const remainingTasks = alltasks.filter(task => task.status == false);
  localStorage.setItem('tasks', JSON.stringify(remainingTasks));
  window.location.reload(); 
}
