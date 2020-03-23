import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { InviteComponent } from './invite/invite.component';



@NgModule({
  declarations: [ProjectListComponent, ProjectItemComponent, NewProjectComponent, InviteComponent],
  imports: [
    CommonModule
  ]
})
export class ProjectModule { }
