import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { Node } from '../dtos/Node';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTraverserService {
  productService: ProductService;
  categoryService: CategoryService;
  
  constructor(productService: ProductService, categoryService: CategoryService) { 
    this.productService = productService;
    this.categoryService = categoryService;
  }

  function traverseAndSave(root:Node): Observable<Array<Node>>{
    let nodes: Array<Node> = [];
    nodes.push(root);
    for (let i = 0; i < root.children.length; i++) {
      nodes = nodes.concat(traverseAndSave(root.children[i]));
    }
    return of(nodes);    
  }
}
