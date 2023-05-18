// Firebase Configuration
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Firebase Database Reference
  var database = firebase.database();
  
  // Function to add a new task
  function addTask() {
    var taskInput = document.getElementById("task-input").value;
    var currentTime = new Date().toLocaleString();
    var taskData = {
      task: taskInput,
      deadline: "", // Set deadline here
      timeAdded: currentTime
    };
    database.ref("tasks").push(taskData);
  }
  
  // Function to delete a task
  function deleteTask(taskId) {
    database.ref("tasks/" + taskId).remove();
  }
  
  // Function to move a task to completed tasks
  function completeTask(taskId) {
    var completedTaskRef = database.ref("completedTasks/" + taskId);
    database.ref("tasks/" + taskId).once("value", function(snapshot) {
      var taskData = snapshot.val();
      taskData.timeCompleted = new Date().toLocaleString();
      completedTaskRef.set(taskData);
      database.ref("tasks/" + taskId).remove();
    });
  }
  
  // Event listener for Add Task button
  document.getElementById("add-task-btn").addEventListener("click", addTask);
  
  // Event listener for tasks data changes
  database.ref("tasks").on("value", function(snapshot) {
    var taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear previous task list
  
    snapshot.forEach(function(childSnapshot) {
      var taskId = childSnapshot.key;
      var taskData = childSnapshot.val();
  
      var listItem = document.createElement("li");
      listItem.innerHTML = 
        <span>${taskData.task}</span>
        <button onclick="deleteTask('${taskId}')">Delete</button>
        <button onclick="completeTask('${taskId}')">Complete</button>
      ;
      taskList.appendChild(listItem);
    });
  });