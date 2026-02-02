import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/produits';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
