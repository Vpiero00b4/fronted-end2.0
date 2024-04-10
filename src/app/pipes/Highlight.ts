import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class Highlight implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, search: string): any {
    if (!search) {
      return text;
    }
    const pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const regex = new RegExp(pattern, 'gi');

    return this.sanitizer.bypassSecurityTrustHtml(
      text.replace(regex, (match) => `<span class="highlight">${match}</span>`)
    );
  }
}
