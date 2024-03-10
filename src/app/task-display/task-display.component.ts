import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';
import { ApiService, Task } from '../api.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { PerformerInputComponent } from './performer-input/performer-input.component';
import { Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button'; 


@Component({
  selector: 'app-task-display',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatSelectModule, PerformerInputComponent,
    MatButtonModule
  ],
  templateUrl: './task-display.component.html',
  styleUrl: './task-display.component.scss',
})
export class TaskDisplayComponent implements OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  dead = new O.Subject<void>();

  state: 'creating' | 'loading' | 'loaded' | 'error' = 'creating';

  form = new FormGroup({
    id: new FormControl<Task['id'] | undefined>(undefined, Validators.required),
    title: new FormControl<Task['title']>('', Validators.minLength(4)),
    description: new FormControl<Task['description']>('', Validators.minLength(4)),
    deadline: new FormControl<Task['deadline']>(new Date(), (ctl: AbstractControl) => {
      const d = ctl.value as Date;
      if (d < new Date()) {
        return {
          date: true
        };
      }
      return null;
    }),
    priority: new FormControl<Task['priority']>('low'),
    status: new FormControl<Task['status']>('incomplete'),
    performers: new FormControl<Task['performers']>([], (ctl: AbstractControl) => {
      if ((ctl.value as string[]).length) {
        return null;
      }
      return {
        required: true
      };
    }),
  });

  submit() {
    this.api.edit_task(this.form.getRawValue() as any);
    console.log(this.form.getRawValue());
  }

  constructor() {
    this.route.params.pipe(Op.takeUntil(this.dead), Op.switchMap((p) => {
      this.state = 'loading';
      return this.api.fetch_task(p['id']);
    })).subscribe(tsk => {
      if (tsk == undefined) {
        this.state = 'error';
      } else {
        this.state = 'loaded'
        this.form.setValue(tsk);
      }
    });
  }


  ngOnDestroy(): void {
    this.dead.next();
    this.dead.complete();
  }
}
