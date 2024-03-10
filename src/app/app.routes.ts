import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDisplayComponent } from './task-display/task-display.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'task-new', component: TaskDisplayComponent },
  { path: 'task/:id', component: TaskDisplayComponent },
  //{ path: '',   redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];