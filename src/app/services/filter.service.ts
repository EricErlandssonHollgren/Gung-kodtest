import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product.service';
import { ExtendedCategory } from '../interfaces/extended-category.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private nameFilter$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private idFilter$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private priceFilter$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private volumeFilter$: BehaviorSubject<[number,number] | null> = new BehaviorSubject<[number,number] | null>(null);
  private categoryFilter$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private lgaFilter$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  private sortBy$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  getSortBy() {
    return of(this.sortBy$);
  }

  setNameFilter(name: string | null) {
    this.nameFilter$.next(name);
  }

  setIdFilter(id: string | null) {
    this.idFilter$.next(id);
  }

  setPriceFilter(price: number | null) {
    this.priceFilter$.next(price);
  }

  setVolumeFilter(volume: [number,number] | null) {
    this.volumeFilter$.next(volume);
  }

  setCategoryFilter(category: string | null) {
    this.categoryFilter$.next(category);
  }

  setLgaFilter(lga: boolean | null) {
    this.lgaFilter$.next(lga);
  }

  setSortBy(sortBy: string) {
    this.sortBy$.next(sortBy);
  }

  applyFilters(products: Observable<{ [id: string]: Product }>, categoryDict: Observable<{ [id: string]: ExtendedCategory }>): Observable<Product[]> {

    return combineLatest([
      products,
      this.nameFilter$,
      this.idFilter$,
      this.priceFilter$,
      this.volumeFilter$,
      this.categoryFilter$,
      this.lgaFilter$,
      this.sortBy$,
      categoryDict
    ]).pipe(
      map(([products, name, id, price, volume, category, lga, sortBy, categoryDict]) => {
        let filteredProducts = Object.values(products).filter(product => {
          const isInStock = !lga || parseFloat(product.extra['AGA']['LGA']) > 0;
          const matchesName = !name || product.name.includes(name);
          const matchesId = !id || product.id.includes(id);
          const matchesPrice = !price || product.extra['AGA']['PRI'] <= price;
          const matchesVolume = !volume || (product.extra['AGA']['VOL'] >= Math.min(...volume) && product.extra['AGA']['VOL'] <= Math.max(...volume));
          const matchesCategory = !category || (categoryDict[category]?.products.has(product.id));
          return matchesName && matchesId && matchesPrice && matchesVolume && matchesCategory && isInStock;
        });
        
        switch(sortBy) {
          case 'Category':
            filteredProducts.sort((a, b) => categoryDict[a.extra['AGA']['CAT']].name.localeCompare(categoryDict[b.extra['AGA']['CAT']].name));
            break;
          case 'Volume':
            filteredProducts.sort((a, b) => a.extra['AGA']['VOL'] - b.extra['AGA']['VOL']);
            break;
          case 'Stock':
            filteredProducts.sort((a, b) => parseFloat(b.extra['AGA']['LGA']) - parseFloat(a.extra['AGA']['LGA']));
            break;
          case 'Price':
            filteredProducts.sort((a, b) => a.extra['AGA']['PRI'] - b.extra['AGA']['PRI']);
            break;
        }
        return filteredProducts;
      })
    );
  }
}
