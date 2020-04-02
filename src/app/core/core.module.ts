import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppStoreModule } from '../reducers';
import { SharedModule } from '../shared/shared.module';
import { ServicesModule } from '../services/services.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { loadSvgResouces } from '../utils/svg.util';
import { debug } from '../utils/debug.util';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SidebarComponent],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AppRoutingModule
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    ServicesModule.forRoot(),
    AppStoreModule
  ],
  providers: [
    {
      provide: 'BASE_CONFIG',
      useValue: {
        uri: 'http://localhost:8080'
      }
    }
  ]
})
export class CoreModule {
  // use SkipSelf to avaid always throw error
  // use Optional to define CoreModule is optional
  constructor(
    @Optional() @SkipSelf() parent: CoreModule,
    ir: MatIconRegistry,
    ds: DomSanitizer) {
    if (parent) {
      throw new Error('模块已经存在，不能再次加载!');
    }
    loadSvgResouces(ir, ds);
  }
}
