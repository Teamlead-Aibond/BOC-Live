import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordPatternDirective } from './directives/password-pattern.directive';
import { MatchPasswordDirective } from './directives/match-password.directive';

@NgModule({
  declarations: [PasswordPatternDirective, MatchPasswordDirective],
  imports: [
    CommonModule,
    
  ]
})
export class CoreModule { }
