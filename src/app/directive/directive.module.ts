import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDirective } from './drag-drop/drag.directive';
import { DropDirective } from './drag-drop/drop.directive';



@NgModule({
  declarations: [DragDirective, DropDirective],
  imports: [
    CommonModule
  ]
})
export class DirectiveModule { }
