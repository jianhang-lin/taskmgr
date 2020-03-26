import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DragData {
  tag: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  // tslint:disable-next-line:variable-name
  private _dragData = new BehaviorSubject<DragData>(null);


  getDragData(): Observable<DragData> {
    return this._dragData.asObservable();
  }

  setDragData(data: DragData) {
    this._dragData.next(data);
  }

  clearDragData() {
    this._dragData.next(null);
  }

  constructor() { }
}
