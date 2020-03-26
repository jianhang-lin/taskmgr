import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('wang@163.com', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl()
    });
  }

  onSubmit(form: FormGroup, ev: Event) {
  }
}
