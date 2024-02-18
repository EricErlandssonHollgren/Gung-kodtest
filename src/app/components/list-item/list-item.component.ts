import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css'
})

export class ListItemComponent {
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() price: number = -1;
  @Input() category: string = '';
  @Input() LGA: number = -1;
  inStock: boolean = false;
  
  ngOnInit() {
    this.inStock = this.LGA > 0;
    console.log(this.inStock);
  }
}
