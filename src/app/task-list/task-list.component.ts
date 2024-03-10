import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ApiService, Task } from '../api.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

function changes_initial(fc: FormControl) {
  return fc.valueChanges.pipe(Op.startWith(fc.value));
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule, MatButtonModule, MatIconModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource = new MatTableDataSource<Task>();
  displayedColumns: string[] = ['title', 'deadline', 'status', 'priority', 'performers'];
  dead = new O.Subject<void>();

  available_performers = this.api.list_performers();
  filter_performer = new FormControl('');
  filter_title = new FormControl('');
  filter_incomplete = new FormControl(false);

  ngOnInit() {
    O.combineLatest([
      this.api.list_tasks(),
      changes_initial(this.filter_performer),
      changes_initial(this.filter_title),
      changes_initial(this.filter_incomplete),
    ])
      .pipe(Op.takeUntil(this.dead))
      .subscribe(([tasks, fp, ft, fi]) => {
        if (fi) {
          tasks = tasks.filter(tt => tt.status == 'incomplete');
        }
        if (fp) {
          fp = fp.toLowerCase();
          tasks = tasks.filter(tt => tt.performers.find(s => s.toLowerCase().includes(fp)))
        }
        if (ft) {
          ft = ft.toLowerCase();
          tasks = tasks.filter(tt => tt.title.toLowerCase().includes(ft))
        }
        this.dataSource.data = tasks;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy(): void {
    this.dead.next();
    this.dead.complete();
  }

  row_click(t: Task) {
    this.router.navigate(['task', t.id]);
  }
}
