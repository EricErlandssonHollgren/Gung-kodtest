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
  @Input() LGA: string = '';
  @Input() volume: string = '';
  inStock: boolean = false;
  
  ngOnInit() {
    this.inStock = parseFloat(this.LGA) > 0;
  }
}
