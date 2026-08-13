import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="todo-app">
      <h1>My To-Do List</h1>
      <p class="subtitle">Add a task and keep track of your work.</p>

      <form class="task-form" (ngSubmit)="addTask()">
        <input
          type="text"
          [(ngModel)]="taskName"
          name="taskName"
          placeholder="What do you need to do?"
          autocomplete="off"
        />
        <button type="submit">Add</button>
      </form>

      <p class="message" aria-live="polite">{{ message }}</p>

      <ul class="task-list">
        <li *ngFor="let task of tasks" class="task-item" [class.completed]="task.completed">
          <input
            type="checkbox"
            [checked]="task.completed"
            [attr.aria-label]="'Mark ' + task.name + ' as completed'"
            (change)="toggleTask(task.id)"
          />
          <span>{{ task.name }}</span>
          <button type="button" class="delete-button" (click)="deleteTask(task.id)">
            Delete
          </button>
        </li>
      </ul>
    </main>
  `,
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  taskName = '';
  message = '';

  ngOnInit(): void {
    const storedTasks = localStorage.getItem('tasks');
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
  }

  saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(): void {
    const trimmedName = this.taskName.trim();

    if (!trimmedName) {
      this.message = 'Please enter a task.';
      return;
    }

    this.tasks.push({
      id: crypto.randomUUID(),
      name: trimmedName,
      completed: false,
    });

    this.saveTasks();
    this.taskName = '';
    this.message = '';
  }

  toggleTask(id: string): void {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.saveTasks();
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }
}
