import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { NewProjectComponent } from './new-project/new-project.component';



@NgModule({
  declarations: [ProjectListComponent, ProjectItemComponent, NewProjectComponent],
  imports: [
    CommonModule
  ]
})
export class ProjectModule { }
