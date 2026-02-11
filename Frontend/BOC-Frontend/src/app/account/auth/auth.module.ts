/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing';
import { ConfirmComponent } from './confirm/confirm.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { JunologinComponent } from './junologin/junologin.component';
import { CommonLoginComponent } from './common-login/common-login.component';
import { AutoLoginComponent } from './auto-login/auto-login.component';
import { AboutPageComponent } from './common-login/AboutPage/about-page/about-page.component';
import { PrivacyPageComponent } from './common-login/PrivacyPage/privacy-page/privacy-page.component';
import { TermsPageComponent } from './common-login/TermsPage/terms-page/terms-page.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ConfirmComponent, PasswordresetComponent, JunologinComponent, CommonLoginComponent, AutoLoginComponent, AboutPageComponent, PrivacyPageComponent, TermsPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UIModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
