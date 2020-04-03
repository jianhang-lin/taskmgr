import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { Observable } from 'rxjs';
import { Auth } from '../../services/auth.model';
import * as authActions from '../../actions/auth.action';
import {getAuthState} from '../../reducers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  auth$: Observable<Auth>;
  @Output() toggle = new EventEmitter<void>();
  @Output() toggleDarkTheme = new EventEmitter<boolean>();

  constructor(private store$: Store<fromRoot.State>) {
    this.auth$ = this.store$.select(getAuthState);
  }

  ngOnInit() {
  }

  openSideBar() {
    this.toggle.emit();
  }

  onChange(checked: boolean) {
    this.toggleDarkTheme.emit(checked);
  }

  logout() {
    this.store$.dispatch(new authActions.LogoutAction(null));
  }
}
