import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./task-list/task-list.component').then(mod => mod.TaskListComponent) },
  { path: 'task-new', loadComponent: () => import('./task-display/task-display.component').then(mod => mod.TaskDisplayComponent) },
  { path: 'task/:id', loadComponent: () => import('./task-display/task-display.component').then(mod => mod.TaskDisplayComponent) },
  //{ path: '',   redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];