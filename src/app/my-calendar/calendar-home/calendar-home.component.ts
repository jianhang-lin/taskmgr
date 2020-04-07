import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CalendarEventTimesChangedEvent } from 'angular-calendar';
import {map, switchMap} from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { startOfDay, endOfDay } from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#d1e8ff'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#fdf1ba'
  }
};

const getColor = (priority: number) => {
  switch (priority) {
    case 1:
      return colors.red;
    case 2:
      return colors.blue;
    default:
      return colors.yellow;
  }
};

@Component({
  selector: 'app-calendar-home',
  templateUrl: './calendar-home.component.html',
  styleUrls: ['./calendar-home.component.scss']
})
export class CalendarHomeComponent implements OnInit {

  viewDate: Date;
  view$: Observable<string>;
  events$: Observable<CalendarEventTimesChangedEvent>;
  constructor(private route: ActivatedRoute,
              private service$: TaskService,
              private store$: Store<fromRoot.State>) {
    this.viewDate = new Date();
    this.view$ = this.route.paramMap.pipe(map(p => p.get('view')));
    // @ts-ignore
    this.events$ = this.store$.select(fromRoot.getAuthState).pipe(
      map(auth => auth.user.id),
      switchMap(userId => this.service$.getUserTasks(userId)),
      map(tasks => tasks.map(task => {
        return {
          start: startOfDay(task.createDate),
          end: endOfDay(task.dueDate),
          title: task.desc,
          color: getColor(task.priority)
        };
      }))
    );
  }

  ngOnInit(): void {
  }

  handleEvent(event: any) {

  }
}
