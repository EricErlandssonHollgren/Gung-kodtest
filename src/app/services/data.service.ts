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
  
  private categoryDict: { [id: string]: ExtendedCategory };
  //private categoryDict$: BehaviorSubject<{ [id: string]: ExtendedCategory }>;
  
  private productData: { [id: string]: Product };
  private productDict$: BehaviorSubject<{ [id: string]: Product }>;
  
  //public categoryDict: Observable<{ [id: string]: ExtendedCategory }>;
  public productDict: Observable<{ [id: string]: Product }>;
  
  constructor(categoryService: CategoryService, productService: ProductService) { 
    this.categoryService = categoryService;
    this.productService = productService;
    this.productData = {};
    this.categoryDict = {};

    //Make the categoryDict$ a BehaviorSubject  
    //this.categoryDict$ = new BehaviorSubject(this.categoryData);
    //expose
    //this.categoryDict = this.categoryDict$.asObservable();
    //Make the productDict$ a BehaviorSubject
    this.productDict$ = new BehaviorSubject(this.productData);
    //expose
    this.productDict = this.productDict$.asObservable();

    this.categoryService.getCategories().subscribe(categories => {
      this.populateProducts(categories);
      this.populateCategories(categories);
    });
    //console.log(this.categoryDict);
  }
  // Enable adding products to the productDict and emitting the new value
  addProduct(product: Product) {
    let newData = this.productDict$.getValue();
    newData[product.id] = product;
    this.productDict$.next(newData);
  }
  
  /*public getProductDict():Observable<{ [id: string]: Product }>{
    return of(this.productDict);
  }*/

  public getCategoryDict():Observable<{ [id: string]: ExtendedCategory }>{
    return of(this.categoryDict);
  }

   // Function to recursively populate categories and products
   private populateCategories(category: Category, parentCategoryId: string | null = null) {
    if (category.id.startsWith('s')) { // It's a category
      // Initialize the category in categoryDict if not already present
      if (!this.categoryDict[category.id]) {
        this.categoryDict[category.id] = {...category, products: new Set<string>(), childCategories: new Set<string>()};
      }
      // Link this category to its parent
      if (parentCategoryId) {
        this.categoryDict[parentCategoryId].childCategories.add(category.id);
      }
      // Recursively process child categories
      category.children.forEach(child => this.populateCategories(child, category.id));
    } else { // It's a product
      // Add this product to the current category and all parent categories
      let currentCategoryId = parentCategoryId;
      while (currentCategoryId) {
        this.categoryDict[currentCategoryId].products.add(category.id);
        currentCategoryId = this.getParentCategoryId(currentCategoryId);
      }
    }
  }
  
  // Function to find the parent category ID
  private getParentCategoryId(categoryId: string): string | null {
    return Object.keys(this.categoryDict).find(id => this.categoryDict[id].childCategories.has(categoryId)) || null;
  }

  private populateProducts(category: Category) {
    if (category.children) {
      category.children.forEach(child => this.populateProducts(child));
    }
    if (category.id && !category.id.startsWith('s')) {
      this.productService.getProduct(category.id).subscribe(product => {
        if (product) {
          this.addProduct(product);
          //this.productData[product.id] = product;
        }
        else { //Used for getAlotOfCategories
          this.addProduct({ id: category.id, name: category.name, extra: {'AGA':{'LGA':1.00}} });
          //this.productData[category.id] = { id: category.id, name: category.name, extra: {'AGA':{'LGA':1.00}} };
        }
      });
    }
  }
}

