import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { getDate } from 'date-fns';
import { ProjectModel } from '../../domain';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as acitons from '../../actions/project.action';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() navClick = new EventEmitter<void>();
  today = 'day';
  projects$: Observable<ProjectModel[]>;
  constructor(private store$: Store<fromRoot.State>) {
    this.projects$ = this.store$.select(fromRoot.getProjects);
  }

  ngOnInit() {
    this.today = `day${getDate(new Date())}`;
  }

  onNavClick() {
    this.navClick.emit();
  }

  onPrjClick(prj: ProjectModel) {
    this.store$.dispatch(new acitons.SelectAction(prj));
    this.navClick.emit();
  }
}
