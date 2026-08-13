angular.module("todoApp", [])
  .controller("TodoController", function () {
    var vm = this;

    vm.taskName = "";
    vm.message = "";
    vm.tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(vm.tasks));
    }

    vm.addTask = function () {
      var trimmedName = vm.taskName.trim();

      if (!trimmedName) {
        vm.message = "Please enter a task.";
        return;
      }

      vm.tasks.push({
        id: (Date.now() + Math.random()).toString(36),
        name: trimmedName,
        completed: false,
      });

      saveTasks();
      vm.taskName = "";
      vm.message = "";
    };

    vm.toggleTask = function (id) {
      vm.tasks = vm.tasks.map(function (task) {
        return task.id === id ? Object.assign({}, task, { completed: !task.completed }) : task;
      });
      saveTasks();
    };

    vm.deleteTask = function (id) {
      vm.tasks = vm.tasks.filter(function (task) {
        return task.id !== id;
      });
      saveTasks();
    };
  });
