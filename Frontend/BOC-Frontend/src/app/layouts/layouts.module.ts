import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from 'ng-click-outside';

import { UIModule } from '../shared/ui/ui.module';
import { LayoutComponent } from './layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarModule } from 'ng-sidebar';
import { NgbTypeaheadModule, NgbPaginationModule, NgbModule, NgbTooltipModule, NgbDropdownModule, NgbTabsetModule, NgbDatepickerModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [LayoutComponent, SidebarComponent, TopbarComponent, FooterComponent, RightsidebarComponent, NavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgbCollapseModule,
    ClickOutsideModule,
    UIModule,
    FormsModule,
    NgSelectModule,
    NgbTooltipModule,
    SidebarModule.forRoot(),NgxSpinnerModule
  ]
})
export class LayoutsModule { }
