document.addEventListener('DOMContentLoaded', (event) => {
    displayTasks();
    document.getElementById('sortSelect').addEventListener('change', displayTasks);
  });
  

  function createTask() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const dueDate = document.getElementById('date').value;
    const completed = false;
  
    if (title === '' ||  dueDate === '' || description === '') {
      alert('Title or Date cannot be empty');
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
  
    alert('Task added successfully');
  }
  
  function clearFormFields() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
  }
  
  function displayTasks() {
    const taskContainer = document.getElementById('task-container');
    const taskcomplete = document.getElementById('completed-container');
    taskcomplete.innerHTML = ''
    taskContainer.innerHTML = '';
    var sortOption = document.getElementById('sortSelect').value;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.sort(function(a, b) {
      if (sortOption === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
  
    tasks.forEach(function(task, index) {
      const taskDiv = document.createElement('div');
      if(task.status == false){
            taskDiv.className = 'task';
            var today = new Date().toISOString().split('T')[0]; 
            if(task.dueDate <= today){
              var elements = document.querySelectorAll('.task-cont > b');
              elements.forEach(function(element) {
                element.style.color = '#C03503';
                element.style.backgroundColor = '#C035030F';
                element.style.border = '1px solid #C035030F';
              });
            }
            taskDiv.innerHTML = `
            <div class="item-straight">
            <div class="radio-div">
                <input type="radio" id="verify" onclick="taskCompleted(${index})">
            </div>
            <div class="space-content">
            <div class="task-cont">
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <b><img src="image/calendar.svg" > by  ${task.dueDate} </b>
            </div>
            <div class="svg-image">
                <button type="button"  data-toggle="modal" data-target="#edittask-modal" onclick="editTask(${index})"><img src="image/pen.svg" alt="pen"></button>
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
         <img src="image/done.svg" alt="done">
        <div class="space-content">
        <div class="task-cont">
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <b><img src="image/calendar.svg" > by  ${task.dueDate} </b>
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
  if (newtitle === '' ||  newdueDate === '' || newdescription === '') {
    alert('Title or Date cannot be empty');
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
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  window.location.reload();
  alert('Task deleted successfully');
}