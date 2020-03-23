import { Component } from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'taskmgr';

  darkTheme = false;

  constructor(private oc: OverlayContainer) {

  }


  switchThme(dark: boolean) {
    this.darkTheme = dark;
    this.oc.getContainerElement().classList.add(dark ? 'taskmgr-dark-theme' : null);
  }
}
