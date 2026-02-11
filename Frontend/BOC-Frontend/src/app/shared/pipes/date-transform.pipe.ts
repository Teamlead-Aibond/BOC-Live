import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import GlobalConstants from 'src/app/core/consts/global.constants';

@Pipe({
  name: 'dateTransform'
})
export class DateTransformPipe implements PipeTransform {

  transform(date: string): string {
    if (!date) return "";
    if (date.includes("T"))
      date = date.split('T')[0]
    return moment(date).format(GlobalConstants.DATE_FORMAT);
  }

}
