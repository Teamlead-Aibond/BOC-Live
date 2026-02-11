import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MonthTransformPipe } from './month-transform.pipe';
import { DateTimeTransformPipe } from './date-time-transform.pipe';
import { DateTransformPipe } from './date-transform.pipe';
import { CurrencyTransformPipe } from './currency-transform.pipe';
import { PrettyPrintPipe } from './pretty-print.pipe';



@NgModule({
  declarations: [
    MonthTransformPipe,
    DateTimeTransformPipe,
    DateTransformPipe,
    CurrencyTransformPipe,
    PrettyPrintPipe
  ],
  exports: [
    MonthTransformPipe,
    DateTimeTransformPipe,
    DateTransformPipe,
    CurrencyTransformPipe,
    PrettyPrintPipe
  ],
  imports: [
    CommonModule
  ],
  providers:[
    CurrencyPipe
  ]
})
export class PipesModule { }
