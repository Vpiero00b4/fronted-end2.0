import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {

transform(value: string | undefined, limit = 20, completeWords = false, ellipsis = '...'): string {
    if (!value) return ''; // 👈 Maneja null o undefined
    if (value.length <= limit) return value;
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return value.substr(0, limit) + ellipsis;
  }

}
