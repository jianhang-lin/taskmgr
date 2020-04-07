import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarHomeComponent } from './calendar-home/calendar-home.component';
import { CalendarModule } from 'angular-calendar';
import { MyCalendarRoutingModule } from './my-calendar-routing.module';


@NgModule({
  declarations: [CalendarHomeComponent],
  imports: [
    CommonModule,
    MyCalendarRoutingModule,
    CalendarModule
  ]
})
export class MyCalendarModule { }
