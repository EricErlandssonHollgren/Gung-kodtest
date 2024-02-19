import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Product } from '../../services/product.service';
import { ListItemComponent } from '../list-item/list-item.component';
import { DataService } from '../../services/data.service';
import { FilterService } from '../../services/filter.service';
import { Observable, lastValueFrom } from 'rxjs';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ScrollingModule, ListItemComponent, SkeletonLoaderComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[];
  dataService: DataService;
  filterService: FilterService;
  filteredProducts$: Observable<Product[]>;
  public isLoading: boolean = true;
  
  //Dependency injection of ProductService
  constructor(dataService: DataService, filterService: FilterService) {
    this.dataService = dataService;
    this.filterService = filterService;
    this.products = [];

    this.filteredProducts$ = this.filterService.applyFilters(this.dataService.productDict, this.dataService.getCategoryDict());
  }
}