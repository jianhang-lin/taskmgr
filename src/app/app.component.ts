import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'taskmgr';

  darkTheme = false;
  switchThme(dark: boolean) {
    this.darkTheme = dark;
  }
}
