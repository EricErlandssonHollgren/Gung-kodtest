import { Injectable } from '@angular/core';
import { CategoryService, Category } from './category.service';
import { ProductService, Product } from './product.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ExtendedCategory } from '../interfaces/extended-category.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private categoryService: CategoryService;
  private productService: ProductService;

  private categoryData: { [id: string]: ExtendedCategory };
  private categoryDict$: BehaviorSubject<{ [id: string]: ExtendedCategory }>;

  private productData: { [id: string]: Product };
  private productDict$: BehaviorSubject<{ [id: string]: Product }>;

  public productDict: Observable<{ [id: string]: Product }>;
  public categoryDict: Observable<{ [id: string]: ExtendedCategory }>;

  constructor(categoryService: CategoryService, productService: ProductService) {
    this.categoryService = categoryService;
    this.productService = productService;

    this.productData = {};
    this.categoryData = {};

    this.categoryDict$ = new BehaviorSubject(this.categoryData);
    this.productDict$ = new BehaviorSubject(this.productData);
    //expose
    this.productDict = this.productDict$.asObservable();
    this.categoryDict = this.categoryDict$.asObservable();

    this.categoryService.getCategories().subscribe(categories => {
      this.populateProducts(categories);
      this.populateCategories(categories);
    });
  }
  // Enable adding products to the productDict and emitting the new value
  addProduct(product: Product) {
    let newData = this.productDict$.getValue();
    newData[product.id] = product;
    this.productDict$.next(newData);
  }
  // Enable adding categories to the categoryDict and emitting the new value
  addCategory(category: Category, products: Set<string> = new Set<string>(), childCategories: Set<string> = new Set<string>()) {
    let newData = this.categoryDict$.getValue();
    newData[category.id] = {
      ...category,
      products: products,
      childCategories: childCategories
    }
    this.categoryDict$.next(newData);
  }

  private populateCategories(category: Category, parentCategoryId: string | null = null) {
    if (category.id.startsWith('s')) {
      this.addCategory(category as ExtendedCategory);
      // Link this category to its parent
      if (parentCategoryId) {
        let newData = this.categoryDict$.getValue();
        newData[parentCategoryId].childCategories.add(category.id);
        this.categoryDict$.next(newData);
      }
      // Recursively process child categories
      category.children.forEach(child => this.populateCategories(child, category.id));
    } else { // It's a product
      // Add this product to the current category and all parent categories
      let currentCategoryId = parentCategoryId;
      while (currentCategoryId) {
        let newData = this.categoryDict$.getValue();
        newData[currentCategoryId].products.add(category.id);
        this.categoryDict$.next(newData);
        currentCategoryId = this.getParentCategoryId(currentCategoryId);
      }
    }
  }

  // Function to find the parent category ID
  private getParentCategoryId(categoryId: string): string | null {
    const currentCategoryData = this.categoryDict$.getValue();
    return Object.keys(currentCategoryData)
      .find(id => currentCategoryData[id].childCategories.has(categoryId)) || null;
  }

  private populateProducts(category: Category, parentCategory: string = '') {
    if (category.children) {
      category.children.forEach(child => this.populateProducts(child, category.id));
    }
    if (category.id && !category.id.startsWith('s')) {
      this.productService.getProduct(category.id).subscribe(product => {
        if (product) {
          product.extra['AGA']['CAT'] = parentCategory;
          this.addProduct(product);
        } else { //Used for getAlotOfCategories, Rand product won't work since products are stored in dictionary id will be the same
          this.addProduct({ id: category.id, name: category.name, extra: { 'AGA': { 'LGA': 1.00 , 'CAT': parentCategory, 'PRI': 1550} } });
        }
      });
    }
  }
}

