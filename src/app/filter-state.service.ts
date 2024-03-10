import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {

  constructor() { }

  performer = new FormControl('');
  title = new FormControl('');
  incomplete = new FormControl(false);
}
