import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StockMovementService } from '../../../services/stock-movement.service';
import { ProductService } from '../../../services/product.service';
import { StockMouvement } from '../../../models/stock-movement.model';
import { Produit } from '../../../models/product.model';

@Component({
  selector: 'app-stock-movement-form',
  standalone: false,
  templateUrl: './stock-movement-form.component.html',
  styleUrls: ['./stock-movement-form.component.css']
})
export class StockMovementFormComponent implements OnInit {
  stockMovementForm: FormGroup;
  products: Produit[] = [];
  isEditMode: boolean = false;
  stockMovementId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private stockMovementService: StockMovementService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.stockMovementForm = this.fb.group({
      ProduitId: ['', Validators.required],
      quantite: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      userId: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.stockMovementId = +params['id'];
        this.loadStockMovement(this.stockMovementId);
      }
    });
  }

  loadStockMovement(id: number): void {
    this.stockMovementService.getStockMovementById(id).subscribe({
      next: (stockMovement: StockMouvement) => {
        const dateValue = stockMovement.date ? new Date(stockMovement.date).toISOString().split('T')[0] : '';
        this.stockMovementForm.patchValue({
          ProduitId: stockMovement.ProduitId,
          quantite: stockMovement.quantite,
          type: stockMovement.type,
          date: dateValue,
          userId: stockMovement.userId
        });
      },
      error: (error) => {
        this.errorMessage = 'Error loading stock movement: ' + (error.error?.message || error.message);
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Produit[]) => {
        this.products = data;
      },
      error: (error) => {
        this.errorMessage = 'Error loading products: ' + (error.error?.message || error.message);}
    });
  }

  onSubmit(): void {
    if (this.stockMovementForm.valid) {
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.stockMovementForm.value;

      if (this.isEditMode) {
        const stockMovement: StockMouvement = {
          id: this.stockMovementId!,
          ProduitId: parseInt(formValue.ProduitId),
          quantite: parseInt(formValue.quantite),
          type: formValue.type,
          date: new Date(formValue.date),
          userId: parseInt(formValue.userId)
        };

        this.stockMovementService.updateStockMovement(this.stockMovementId!, stockMovement).subscribe({
          next: () => {
            this.successMessage = 'Stock movement updated successfully!';
            setTimeout(() => {
              this.router.navigate(['/stock-movements']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = 'Error updating stock movement: ' + (error.error?.message || error.message);
          }
        });
      } else {
        const stockMovementData: Omit<StockMouvement, 'id'> = {
          ProduitId: parseInt(formValue.ProduitId),
          quantite: parseInt(formValue.quantite),
          type: formValue.type,
          date: new Date(formValue.date),
          userId: parseInt(formValue.userId)
        };

        this.stockMovementService.createStockMovement(stockMovementData).subscribe({
          next: (createdMovement: StockMouvement) => {
            this.successMessage = 'Stock movement created successfully!';
            this.stockMovementForm.reset();
            this.stockMovementForm.patchValue({
              date: new Date().toISOString().split('T')[0],
              userId: 1
            });
            setTimeout(() => {
              this.router.navigate(['/stock-movements']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = 'Error creating stock movement: ' + (error.error?.message || error.message);
          }
        });
      }
    } else {
      Object.keys(this.stockMovementForm.controls).forEach(key => {
        this.stockMovementForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/stock-movements']);
  }
}
