import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { QuoteEffects } from './quote.effects';
import { AuthEffects } from './auth.effects';
import { RouterEffects } from './router.effects';
import { ProjectEffects } from './project.effects';
import { TaskListEffects } from './task-list.effects';
import {UserEffects} from './user.effects';
import {TaskEffects} from './task.effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([
      RouterEffects,
      QuoteEffects,
      AuthEffects,
      ProjectEffects,
      TaskListEffects,
      UserEffects,
      TaskEffects
    ])
  ],
})
export class AppEffectsModule {
}
