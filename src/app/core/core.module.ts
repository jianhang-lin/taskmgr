import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CoreModule {
  // use SkipSelf to avaid always throw error
  // use Optional to define CoreModule is optional
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('模块已经存在，不能再次加载!');
    }
  }
}
