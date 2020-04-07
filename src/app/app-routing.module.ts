import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    loadChildren: () => import(`./project/project.module`).then(m => m.ProjectModule),
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  },
  {
    path: 'tasklists/:id',
    loadChildren: () => import(`./task/task.module`).then(m => m.TaskModule),
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  },
  {
    path: 'mycal/:view',
    loadChildren: () => import(`./my-calendar/my-calendar.module`).then(m => m.MyCalendarModule),
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
