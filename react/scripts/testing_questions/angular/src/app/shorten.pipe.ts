import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'shorten' })
export class ShortenPipe implements PipeTransform {
  transform(text: string, max = 10) {
    return text.length > max ? text.slice(0, max) + '...' : text
  }
}
