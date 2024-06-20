document.addEventListener('DOMContentLoaded', (event) => {
    displayTasks();
  });
  
  function createTask() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const dueDate = document.getElementById('date').value;
    const completed = false;
  
    if (title === '' &&  dueDate === '') {
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
    taskContainer.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    tasks.forEach(function(task, index) {
      const taskDiv = document.createElement('div');
      if(task.status == false){
            taskDiv.className = 'task';
            taskDiv.innerHTML = `
            <div class="item-straight">
            <div class="radio-div">
                <input type="radio" id="verify">
            </div>
            <div class="space-content">
            <div class="task-cont">
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <b><img src="image/calendar.svg" > by  ${task.dueDate} </b>
            </div>
            <div class="svg-image">
                <img src="image/pen.svg" alt="pen" onclick="editTask(${index})">
                <img src="image/delete.svg" alt="trash" onclick="deleteTask(${index})">
            </div>
            </div>
            </div>
            `;

            taskContainer.appendChild(taskDiv);
    } else {
        taskDiv.className = 'task';
        taskDiv.innerHTML = `
        <div class="item-straight">
         <img src="image/done.svg" alt="done">
        <div class="task-cont">
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p><strong>Due Date:</strong> ${task.dueDate}</p>
        </div>
        <div class="svg-image">
            <img src="image/pen.svg" alt="pen" onclick="editTask(${index})">
            <img src="image/delete.svg" alt="trash" onclick="deleteTask(${index})">
        </div>
        </div>
        `;
    }
  });
  }
  