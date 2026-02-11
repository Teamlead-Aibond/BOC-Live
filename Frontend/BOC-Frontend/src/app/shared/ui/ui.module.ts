import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { ClickOutsideModule } from 'ng-click-outside';

import { CountToDirective } from './count-to.directive';

import { SlimscrollDirective } from './slimscroll.directive';
import { PortletComponent } from './portlet/portlet.component';

import { PreloaderComponent } from './preloader/preloader.component';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { WidgetComponent } from './widget/widget.component';
import { EmaillistComponent } from './emaillist/emaillist.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [SlimscrollDirective, PreloaderComponent, PagetitleComponent, CountToDirective, PortletComponent, WidgetComponent, EmaillistComponent],
  imports: [
    CommonModule,
    FormsModule,
    ClickOutsideModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ],
  // tslint:disable-next-line: max-line-length
  exports: [SlimscrollDirective, PreloaderComponent, PagetitleComponent, CountToDirective, PortletComponent, WidgetComponent, EmaillistComponent]
})
export class UIModule { }
