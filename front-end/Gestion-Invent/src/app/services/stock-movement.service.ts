import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockMouvement } from '../models/stock-movement.model';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {
  private apiUrl = 'http://localhost:8081/api/stock';

  constructor(private http: HttpClient) { }

  getStockMovements(): Observable<StockMouvement[]> {
    return this.http.get<StockMouvement[]>(`${this.apiUrl}/movements`);
  }

  getStockMovementById(id: number): Observable<StockMouvement> {
    return this.http.get<StockMouvement>(`${this.apiUrl}/movement/${id}`);
  }

  createStockMovement(stockMovement: Omit<StockMouvement, 'id'>): Observable<StockMouvement> {
    const payload: any = {
      type: stockMovement.type,
      quantite: stockMovement.quantite,
      produit: {
        id: stockMovement.ProduitId
      }
    };

    return this.http.post<StockMouvement>(`${this.apiUrl}/movement`, payload);
  }

  updateStockMovement(id: number, stockMovement: StockMouvement): Observable<StockMouvement> {
    return this.http.put<StockMouvement>(`${this.apiUrl}/movement/${id}`, stockMovement);
  }

  deleteStockMovement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movement/${id}`);
  }
}
