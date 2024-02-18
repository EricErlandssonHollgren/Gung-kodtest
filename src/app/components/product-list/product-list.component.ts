import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Product } from '../../services/product.service';
import { ListItemComponent } from '../list-item/list-item.component';
import { DataService } from '../../services/data.service';
import { FilterService } from '../../services/filter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ScrollingModule, ListItemComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[];
  dataService: DataService;
  filterService: FilterService;
  filteredProducts$: Observable<Product[]>;
  //Dependency injection of ProductService
  constructor(dataService: DataService, filterService: FilterService) {
    this.dataService = dataService;
    this.filterService = filterService;
    this.products = [];
    
    this.filterService.setNameFilter('s')

    this.filteredProducts$ = this.filterService.applyFilters(this.dataService.productDict, this.dataService.getCategoryDict());
    this.filteredProducts$.subscribe(products => {
      console.log('Filtered Products:', products); // Debugging
      this.products = products;
    });
  }
}