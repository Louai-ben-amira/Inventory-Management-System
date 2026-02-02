import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Produit } from '../../../models/product.model';
import { Categorie } from '../../../models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  categories: Categorie[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product: any) => {
        // Extract category ID from product
        let categoryId = '';
        if (product.categorie_id) {
          categoryId = product.categorie_id;
        } else if (product.categorie && typeof product.categorie === 'object') {
          categoryId = product.categorie.id;
        } else if (product.categorie) {
          categoryId = product.categorie;
        }

        this.productForm.patchValue({
          name: product.nom || product.name,
          category: categoryId,
          price: product.prix || product.price || 0,
          stock: product.quantite || product.quantity || 0
        });
      },
      error: (error) => {
        this.errorMessage = 'Error loading product: ' + (error.error?.message || error.message);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data: Categorie[]) => {
      this.categories = data;
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.errorMessage = '';
      this.successMessage = '';

      // Map form values to Product model
      const formValue = this.productForm.value;

      if (this.isEditMode) {

        const productData: any = {
          id: this.productId!,
          nom: formValue.name,
          prix: parseFloat(formValue.price),
          quantite: parseInt(formValue.stock),
          description: ''
        };

        if (formValue.category) {
          productData.categorie = { id: parseInt(formValue.category) };
        }

        this.productService.updateProduct(this.productId!, productData).subscribe({
          next: () => {
            this.successMessage = 'Product updated successfully!';
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = 'Error updating product: ' + (error.error?.message || error.message);
            console.error('Error updating product:', error);
          }
        });
      } else {

        const productData: any = {
          nom: formValue.name,
          prix: parseFloat(formValue.price),
          quantite: parseInt(formValue.stock),
          description: ''
        };

        if (formValue.category) {
          productData.categorie = { id: parseInt(formValue.category) };
        }

        this.productService.createProduct(productData).subscribe({
          next: (createdProduct: Produit) => {
            this.successMessage = 'Product created successfully!';
            this.productForm.reset();
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = 'Error creating product: ' + (error.error?.message || error.message);
            console.error('Error creating product:', error);
            console.error('Product data sent:', productData);
          }
        });
      }
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
