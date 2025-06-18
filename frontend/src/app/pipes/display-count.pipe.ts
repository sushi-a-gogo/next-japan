import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayCount',
})
export class DisplayCountPipe implements PipeTransform {
  displayNumbers = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

  transform(value: unknown, ...args: unknown[]): unknown {
    const num = Number(value);
    if (!isNaN(num)) {
      if (num < this.displayNumbers.length) {
        return this.displayNumbers[num];
      }
    }

    return value;
  }
}
