import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import * as O from 'rxjs';
import * as Op from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { ControlValueAccessor, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-performer-input',
  standalone: true,
  imports: [MatChipsModule, MatAutocompleteModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, CommonModule, MatIconModule],
  templateUrl: './performer-input.component.html',
  styleUrl: './performer-input.component.scss',
})
export class PerformerInputComponent implements OnInit {
  private api = inject(ApiService);
  @Input() control!: FormControl<string[] | null>;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('chipGrid') chipGrid: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  perfs: O.Observable<string[] | null> = O.of([]);
  availablePerfs: O.Observable<string[]> = O.of([]);

  dead = new O.Subject<void>();

  ngOnInit(): void {
    this.perfs = this.control.valueChanges.pipe(
      Op.startWith(this.control.value),
      Op.shareReplay(1),
    );

    this.availablePerfs = O.combineLatest([this.perfs, this.api.list_performers()])
      .pipe(
        Op.map(([perfs, aperfs]) => aperfs.filter(x => !perfs!.includes(x))),
        Op.shareReplay(1),
      );

    this.control.statusChanges.pipe(Op.takeUntil(this.dead)).subscribe(x => {
      this.chipGrid.errorState = x == 'INVALID';
    });
  }
  
  ngOnDestroy(): void {
    this.dead.next();
    this.dead.complete();
  }


  add(event: MatChipInputEvent) {
    this.availablePerfs.pipe(Op.take(1)).subscribe(ps => {
      if (ps.includes(event.value)) {
        this.control.setValue([...this.control.value!, event.value]);
      }
      event.chipInput.clear();
      this.control.markAsDirty();
    })
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.availablePerfs.pipe(Op.take(1)).subscribe(ps => {
      if (ps.includes(event.option.value)) {
        this.control.setValue([...this.control.value!, event.option.value])
      }
      this.input.nativeElement.value = '';
      this.control.markAsDirty();
    })
  }

  remove(perf: string) {
    const arr = structuredClone(this.control.value!)
    const index = arr.indexOf(perf);
    if (index >= 0) {
      arr.splice(index, 1)
      this.control.setValue(arr);
    }
    this.control.markAsDirty();
  }
}
