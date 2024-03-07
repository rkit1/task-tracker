import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';
import { ApiService, Task } from '../api.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { PerformerInputComponent } from './performer-input/performer-input.component';


@Component({
  selector: 'app-task-display',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatSelectModule, PerformerInputComponent
  ],
  templateUrl: './task-display.component.html',
  styleUrl: './task-display.component.scss',
})
export class TaskDisplayComponent implements OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private subscribtions: O.Subscription[] = []

  state: 'creating' | 'loading' | 'loaded' | 'error' = 'creating';

  form = new FormGroup({
    id: new FormControl<Task['id'] | undefined>(undefined),
    title: new FormControl<Task['title']>(''),
    description: new FormControl<Task['description']>(''),
    deadline: new FormControl<Task['deadline']>(new Date()),
    priority: new FormControl<Task['priority']>('low'),
    status: new FormControl<Task['status']>('incomplete'),
    performers: new FormControl<Task['performers']>([]),
  });

  constructor() {
    this.subscribtions.push(this.route.params.pipe(Op.switchMap((p) => {
      this.state = 'loading';
      return this.api.fetch_task(p['id']);
    })).subscribe(tsk => {
      if (tsk == undefined) {
        this.state = 'error';
      } else {
        this.state = 'loaded'
        this.form.setValue(tsk);
      }
    }));
  }

  ngOnDestroy() {
    this.subscribtions.forEach(s => s.unsubscribe());
  }
}
