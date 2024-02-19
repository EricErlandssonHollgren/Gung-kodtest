import { Component } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { debounceTime, Subject } from 'rxjs';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css'
})
export class ControlPanelComponent {
  private filterService: FilterService;
  private searchSubject: Subject<string>;
  private inStockSubject: Subject<boolean>;
  private idSubject: Subject<string>;
  private priceSubject: Subject<number>;
  private dataService: DataService;

  selectedCategory: string;
  selectedSort: string;
  public categories: string[];
  public displayPrice:number;
  public sortByList: string[];

  constructor(filterService: FilterService, dataService: DataService) {
    this.selectedCategory = '';
    this.selectedSort = '';
    this.filterService = filterService; 
    this.dataService = dataService;
    this.searchSubject = new Subject<string>();
    this.inStockSubject = new Subject<boolean>();
    this.idSubject = new Subject<string>();
    this.priceSubject = new Subject<number>();
    this.displayPrice = 5000;
    this.categories = [];
    this.sortByList = ['Category', 'Volume', 'Stock'];

    this.dataService.getCategoryDict().subscribe((categories) => {
      this.categories = Object.keys(categories);
    });
    this.priceSubject.subscribe((value) => {
        this.displayPrice = value;
    });
    this.priceSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.filterService.setPriceFilter(value);
    });
    this.idSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.filterService.setIdFilter(value);
    });
    this.searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.filterService.setNameFilter(value);
    });
    this.inStockSubject.pipe(debounceTime(100)).subscribe((value) => {
      this.filterService.setLgaFilter(value);
    });
  }
  onMaxPriceChange(event: Event) {
    const maxPrice = +(event.target as HTMLInputElement).value;
    this.priceSubject.next(maxPrice);
  }
  onNameFilterChange(event:Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    if(inputValue.includes('id:')){
      const id = inputValue.split('id:')[1];
      this.searchSubject.next('');
      this.idSubject.next(id);
    }else{
      this.searchSubject.next(inputValue);
    }
  }
  onInStockChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.inStockSubject.next(isChecked);
  }
  onIdFilterChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.idSubject.next(inputValue);
  }
  onCategoryChange(category: string) {
    const selectedCategory = category
    this.filterService.setCategoryFilter(selectedCategory);
  }
  onSortChange(sort: string) {
    const selectedSort = sort;
    this.filterService.setSortBy(selectedSort);
  }
}
