import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthTransform'
})
export class MonthTransformPipe implements PipeTransform {

  transform(value: Number | string): string {
    if (typeof (value) === "undefined" || value === null) { return "-" }

    try {
      if (Number(value) === 0) return "No warranty";
      if (Number(value) === 1) return `${value} month`;
      if (Number(value) > 1) return `${value} months`;
      else return ""
    } catch (error) {
      return "";
    }

  }
}
