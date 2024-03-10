import { Component, inject } from '@angular/core';
import { ApiService, Task } from '../api.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  displayedColumns: string[] = ['title', 'deadline', 'status', 'priority', 'performers'];
  tasks = this.api.list_tasks();

  row_click(t: Task) {
    this.router.navigate(['task', t.id]);
   }
}
