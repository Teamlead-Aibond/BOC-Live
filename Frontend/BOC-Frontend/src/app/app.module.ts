import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { FakeBackendProvider } from './core/helpers/fake-backend';

import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators'; // <-- #2 import module
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { QRCodeModule } from 'angularx-qrcode';
import { NgbDateFRParserFormatter } from './pages/datepickerFormat/ngb-date-fr-parser-formatter';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxBarcodeModule } from 'ngx-barcode';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppPreloadingStrategy } from './core/app-preloading-strategy';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStategy } from './router-strategy';
import {SoapserviceService} from '../app/core/services/soapservice.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutsModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    DataTablesModule,
    QRCodeModule, RxReactiveFormsModule,
    AutocompleteLibModule,
    NgxBarcodeModule
  ],
  providers: [
    AppPreloadingStrategy,
    BsModalRef,
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    // { provide: RouteReuseStrategy, useClass: CustomRouteReuseStategy },

    // provider used to create fake backend
    FakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
