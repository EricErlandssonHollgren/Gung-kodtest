import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService;
  private categoryService;
  //Dependency injection of ProductService
  constructor(productService: ProductService, categoryService: CategoryService) {
    
    this.productService = productService;
    this.categoryService = categoryService;

    //this.categoryService.getCategories().subscribe((categories) => {
    //  console.log(categories);
    //});

    //productService.getProduct('VXL-10WK').subscribe((product) => {
    //  console.log(product);
    //});
  }

}
