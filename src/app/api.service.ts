import { Injectable } from '@angular/core';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';


type Optional<T, K extends keyof T> =
  Omit<T, K> & { [P in K]?: T[P] };

export interface Task {
  id: number,
  title: string,
  description: string,
  deadline: Date,
  priority: 'low' | 'medium' | 'high',
  status: "complete" | "incomplete",
  performers: string[]
}

function make_deadline(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d;
}

const initial_tasks: Task[] = [{
  id: Date.now(),
  title: 'test',
  description: 'this is a test task',
  deadline: make_deadline(),
  priority: 'low',
  status: 'incomplete',
  performers: ['Alice', 'Carl']
}];

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private tasks: Task[];

  constructor() {
    try {
      const t = localStorage.getItem('tasks');
      if (!t) {
        throw new Error('Local storage is not initialized');
      }
      this.tasks = JSON.parse(t);
    } catch (e) {
      console.error(e);
      console.error('initializing local storage');
      this.tasks = structuredClone(initial_tasks);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }

  //create_task()
  edit_task(task: Optional<Task, 'id'>) {
    if (task.id != undefined) {
      const to_edit = this.tasks.find(t => t.id == task.id);
      if (!to_edit) {
        return O.throwError(() => {
          return new Error(`task not found`);
        });
      }
      Object.assign(to_edit, task);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      return O.of(to_edit);
    } else {
      task.id = Date.now();
      this.tasks.push(task as Task);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      return structuredClone(task);
    }
  }
  fetch_task(id: number): O.Observable<Task | undefined> {
    return O.of(
      structuredClone(this.tasks.find(x => x.id == id))
    );
  }

  list_tasks(): O.Observable<Task[]> {
    return O.of(structuredClone(this.tasks));
  }

  list_performers(): O.Observable<string[]> {
    return O.of(['Alice', 'Bob', 'Carl']);
  }
}
