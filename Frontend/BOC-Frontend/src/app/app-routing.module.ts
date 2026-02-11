import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppPreloadingStrategy } from './core/app-preloading-strategy';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';


const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  // { path: 'account',  loadChildren:'./account/account.module#AccountModule' },
  // { path: '',  component: LayoutComponent, loadChildren: './pages/pages.module#PagesModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      preloadingStrategy: AppPreloadingStrategy,
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
