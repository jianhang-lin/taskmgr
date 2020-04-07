import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CalendarHomeComponent } from './calendar-home/calendar-home.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { MyCalendarRoutingModule } from './my-calendar-routing.module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


@NgModule({
  declarations: [CalendarHomeComponent],
  imports: [
    SharedModule,
    MyCalendarRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ]
})
export class MyCalendarModule { }
