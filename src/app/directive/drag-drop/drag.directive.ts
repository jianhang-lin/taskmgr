import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDrag][draggedClass]'
})
export class DragDirective {

  private isDraggable = false;
  @Input('appDrag')
  set Draggable(val: boolean) {
    this.isDraggable = val;
    this.rd.setAttribute(this.el.nativeElement, 'draggable', `${val}`);
  }

  get Draggable() {
    return this.isDraggable;
  }

  @Input() draggedClass: string;
  constructor(private el: ElementRef, private rd: Renderer2) { }

  @HostListener('dragstart', ['$event'])
  onDragStart(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.addClass(this.el.nativeElement, this.draggedClass);
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.removeClass(this.el.nativeElement, this.draggedClass);
    }
  }
}
