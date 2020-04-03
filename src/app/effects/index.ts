import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { QuoteEffects } from './quote.effects';
import { AuthEffects } from './auth.effects';
import { RouterEffects } from './router.effects';
import { ProjectEffects } from './project.effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([
      RouterEffects,
      QuoteEffects,
      AuthEffects,
      ProjectEffects
    ])
  ],
})
export class AppEffectsModule {
}
