import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import GlobalConstants from 'src/app/core/consts/global.constants';

@Pipe({
  name: 'dateTimeTransform'
})
export class DateTimeTransformPipe implements PipeTransform {

  transform(datetime: string, breakTime: boolean = false): string {
    if (!datetime) return "";
    if (datetime.includes("T"))
      datetime = datetime.split('T')[0]

    if (breakTime)
      return `${moment(datetime).format(GlobalConstants.DATE_FORMAT)}
              <br/>
              ${moment(datetime).format(GlobalConstants.TIME_FORMAT)}`;
    return moment(datetime).format(GlobalConstants.DATE_TIME_FORMAT);
  }
}
