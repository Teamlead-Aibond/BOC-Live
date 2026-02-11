import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CURRENCY_CODE, CURRENCY_DISPLAY, DIGIT_WHOLE_NUMBER } from 'src/assets/data/dropdown';

@Pipe({
  name: 'currencyTransform'
})
export class CurrencyTransformPipe implements PipeTransform {
  constructor(
    private currencyPipe: CurrencyPipe
  ) {

  }

  // transform(value1) {
  //   // const temp = `${value}`.replace(/\,/g, "");
  //   // return this.currencyPipe.transform(temp).replace("$", "");
  //   if (value1 == undefined || value1 == null || value1 == '')
  //   value1 =  "$ 0"
  //   var value = value1.replace('$','');
  
    
  //   return this.currencyPipe.transform(value,"VND", "$", "1.2-2")
  // }


  transform(value: number): unknown {
    if (value == undefined || value == null)
      value = 0
    return this.currencyPipe.transform(value, CURRENCY_CODE, CURRENCY_DISPLAY, DIGIT_WHOLE_NUMBER)
    // return `₹ ${this.numberPipe.transform(value, '1.0-2')}`;
  }
}
