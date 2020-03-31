import { ModuleWithProviders, NgModule } from '@angular/core';
import { QuoteService } from './quote.service';
import { ProjectService } from './project.service';
import { TaskListService } from './task-list.service';
import {TaskService} from './task.service';
import {UserService} from './user.service';
import {AuthService} from './auth.service';
import {AuthGuardService} from './auth-guard.service';


@NgModule()
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        AuthGuardService,
        AuthService,
        QuoteService,
        ProjectService,
        TaskListService,
        TaskService,
        UserService,
      ]
    };
  }
}
