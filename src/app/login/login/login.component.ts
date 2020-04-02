import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteModel } from '../../domain';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/quote.action';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote$: Observable<QuoteModel>;
  constructor(
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>
  ) {
    this.quote$ = this.store$.pipe(select(fromRoot.getQuote));
    this.store$.dispatch(new actions.LoadAction(null));
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['wang@163.com', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    // this.form.controls.email.setValidators(this.validate);
    this.store$.dispatch(new authActions.LoginAction(value));
  }

}
