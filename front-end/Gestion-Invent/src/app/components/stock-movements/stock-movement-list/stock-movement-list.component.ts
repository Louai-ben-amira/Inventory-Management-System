import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockMovementService } from '../../../services/stock-movement.service';
import { StockMouvement } from '../../../models/stock-movement.model';

@Component({
  selector: 'app-stock-movement-list',
  standalone: false,
  templateUrl: './stock-movement-list.component.html',
  styleUrls: ['./stock-movement-list.component.css']
})
export class StockMovementListComponent implements OnInit {
  stockMovements: StockMouvement[] = [];

  constructor(private stockMovementService: StockMovementService, private router: Router) {}

  ngOnInit(): void {
    this.loadStockMovements();
  }

  loadStockMovements(): void {
    this.stockMovementService.getStockMovements().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.stockMovements = data as StockMouvement[];
        } else if (data && Array.isArray(data.content)) {
          this.stockMovements = data.content as StockMouvement[];
        } else {
          console.warn('Unexpected stock movements response shape:', data);
          this.stockMovements = [];
        }
      },
      (error: any) => {
        console.error('Error fetching stock movements', error);
        this.stockMovements = [];
      }
    );
  }

  addStockMovement(): void {
    this.router.navigate(['/stock-movements/new']);
  }
}
