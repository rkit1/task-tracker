import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';


function make_deadline(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

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
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  dead = new O.Subject<void>();

  state: 'creating' | 'loading' | 'loaded' | 'error' = 'creating';

  form = new FormGroup({
    id: new FormControl<Task['id'] | undefined>(undefined),
    title: new FormControl<Task['title']>('', Validators.minLength(4)),
    description: new FormControl<Task['description']>('', Validators.minLength(4)),
    deadline: new FormControl<Task['deadline']>(make_deadline(), /*(ctl: AbstractControl) => {
      const d = ctl.value as Date;
      if (d < new Date()) {
        return {
          date: true
        };
      }
      return null;
    }*/),
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
    this.api.edit_task(this.form.getRawValue() as any).subscribe({
      next: (value: Task) => {
        this.snackbar.open('Сохранено', 'ok', {
          duration: 3000
        });
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackbar.open('Ошибка', 'ok');
        this.router.navigate(['/']);
      }
    });
  }

  delete_task() {
    this.api.delete_task(this.form.controls.id.value!).subscribe(x => {
      this.snackbar.open('Задача удалена', 'ok', {
        duration: 3000
      });
      this.router.navigate(['/']);
    });
  }

  constructor() {
    this.route.params.pipe(Op.takeUntil(this.dead), Op.switchMap((p) => {
      if (p['id'] !== undefined) {
        this.state = 'loading';
        return this.api.fetch_task(p['id']);
      }
      else {
        this.state = 'creating';
        return O.NEVER;
      }
    })).subscribe(tsk => {
      if (tsk == undefined) {
        this.state = 'error';
      } else {
        this.state = 'loaded'
        this.form.setValue(tsk);
      }
    });
    console.log(this.form);
  }


  ngOnDestroy(): void {
    this.dead.next();
    this.dead.complete();
  }
}
