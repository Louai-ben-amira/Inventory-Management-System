import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { StockMovementService } from '../../services/stock-movement.service';
import { Produit } from '../../models/product.model';
import { StockMouvement } from '../../models/stock-movement.model';
import { Categorie } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalProducts = 0;
  lowStockCount = 0;
  todayMovements = 0;
  searchTerm = '';
  lowStockProducts: Produit[] = [];
  filteredProducts: Produit[] = [];

  private readonly lowStockThreshold = 5;

  constructor(
    private productService: ProductService,
    private stockMovementService: StockMovementService
  ) { }

  ngOnInit(): void {
    this.loadProductStats();
    this.loadMovementStats();
  }

  private loadProductStats(): void {
    this.productService.getProducts().subscribe({
      next: (products: Produit[]) => {
        this.totalProducts = products.length;
        this.lowStockCount = products.filter(p => (p.quantite ?? 0) <= this.lowStockThreshold).length;
        this.lowStockProducts = products.filter(p => (p.quantite ?? 0) <= this.lowStockThreshold);
        this.filteredProducts = products;
      },
      error: () => {
        this.totalProducts = 0;
        this.lowStockCount = 0;
        this.lowStockProducts = [];
        this.filteredProducts = [];
      }
    });
  }

  private loadMovementStats(): void {
    this.stockMovementService.getStockMovements().subscribe({
      next: (moves: StockMouvement[]) => {
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10); 
        this.todayMovements = moves.filter(m => {
          if (!m.date) return false;
          const d = new Date(m.date);
          return d.toISOString().slice(0, 10) === todayStr;
        }).length;
      },
      error: () => {
        this.todayMovements = 0;
      }
    });
  }

  get visibleProducts(): Produit[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.filteredProducts.slice(0, 6);
    }
    return this.filteredProducts
      .filter(p =>
        p.nom.toLowerCase().includes(term) ||
        (p.categorie && this.getCategoryName(p.categorie).toLowerCase().includes(term))
      )
      .slice(0, 6);
  }

  getCategoryName(categorie: string | Categorie): string {
    return typeof categorie === 'string' ? categorie : categorie.nom;
  }

  getCategoryDisplayName(categorie: string | Categorie): string {
    return typeof categorie === 'string' ? categorie : categorie.nom;
  }
}
