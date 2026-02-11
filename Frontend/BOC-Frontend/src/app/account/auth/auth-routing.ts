/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { JunologinComponent } from './junologin/junologin.component';
import { CommonLoginComponent } from './common-login/common-login.component';
import { AutoLoginComponent } from './auto-login/auto-login.component';
import { AboutPageComponent } from './common-login/AboutPage/about-page/about-page.component';
import { PrivacyPageComponent } from './common-login/PrivacyPage/privacy-page/privacy-page.component';
import { TermsPageComponent } from './common-login/TermsPage/terms-page/terms-page.component';

const routes: Routes = [
    {
        path: 'autologin',
        component: AutoLoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'confirm',
        component: ConfirmComponent
    },
    {
        path: 'reset-password',
        component: PasswordresetComponent
    },
    {
        path: 'junologin',
        component: JunologinComponent
    },
    {
        path: 'login',
        component: CommonLoginComponent
    },
    {
        path: 'about-page',
        component: AboutPageComponent
    },
    {
        path: 'privacy-page',
        component: PrivacyPageComponent
    },
    {
        path: 'terms-page',
        component: TermsPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
