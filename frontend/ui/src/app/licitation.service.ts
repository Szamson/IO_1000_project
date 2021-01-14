import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LicitationService {

  private value = new BehaviorSubject<Number>(0);

  currentValue = this.value.asObservable();

  changeValue(val : Number)
  {
    this.value.next(val);
  }

  constructor() { }
}
