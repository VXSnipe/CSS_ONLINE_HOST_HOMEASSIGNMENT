import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true
})
export class StockStatusPipe implements PipeTransform {
  transform(quantity: number): string {
    if (quantity > 3) {
      return 'In Stock';
    } else if (quantity >= 1 && quantity <= 3) {
      return 'Low Stock';
    } else {
      return 'Out of Stock';
    }
  }
}
