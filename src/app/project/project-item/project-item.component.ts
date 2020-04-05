import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { cardAnim } from '../../anim/card.anim';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [
    cardAnim
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent implements OnInit {

  @Input() item;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onInvite = new EventEmitter<void>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onEdit = new EventEmitter<void>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onDel = new EventEmitter<void>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSelected = new EventEmitter<void>();
  @HostBinding('@card') cardState = 'out';

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hover';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.cardState = 'out';
  }

  onInviteClick(en: Event) {
    en.stopPropagation();
    this.onInvite.emit();
  }

  onEditClick(en: Event) {
    en.stopPropagation();
    this.onEdit.emit();
  }

  onDelClick(en: Event) {
    en.stopPropagation();
    this.onDel.emit();
  }

  onClick() {
    this.onSelected.emit();
  }
}
