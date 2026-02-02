import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Produit } from '../../../models/product.model';
import { Categorie } from '../../../models/category.model';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Produit[] = [];
  categories: Categorie[] = [];
  searchTerm: string = '';
  filteredProducts: Produit[] = [];


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Categorie[]) => {
        this.categories = data;
        console.log('Categories loaded:', this.categories);
        this.fetchProducts();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.fetchProducts();
      }
    });
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        console.log('Raw API response:', data);

        this.products = (data || []).map((product: any) => {
          return {
            id: product.id || product.ID || 0,
            nom: product.name || product.nom || product.productName || product.libelle || '',
            categorie: product.categorie ?? this.extractCategory(product),
            prix: product.price || product.prix || product.cost || 0,
            quantite: product.quantity || product.stock || product.quantite || product.qte || 0,
            description: product.description || product.desc || ''
          };
        });

        this.filteredProducts = [...this.products];
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        alert('Error loading products');
      }
    });
  }


  private extractCategory(product: any): string {
    if (product.categorie && typeof product.categorie === 'object' && product.categorie !== null) {
      const name = product.categorie.nom || product.categorie.name || '';
      if (name) {
        return name;
      }
    }

    const possibleCategoryIds = [
      product.categorie_id,
      product.categorieId,
      product.categoryId,
      product.category_id,
      product.idCategorie,
      product.idCategory,
      product.id_categorie,
      product.id_category,
      product.categorie?.id,
      product.category?.id
    ].filter(id => id !== undefined && id !== null);

    for (const categoryId of possibleCategoryIds) {
      if (categoryId !== undefined && categoryId !== null) {
        const id = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId;
        if (!isNaN(id) && id > 0 && this.categories.length > 0) {
          const category = this.categories.find(cat => cat.id === id);
          if (category) {
            console.log(`Found category by ID ${id}:`, category.nom);
            return category.nom;
          }
        }
      }
    }

    if (product.categorie && typeof product.categorie === 'object' && product.categorie !== null) {
      const name = product.categorie.nom || product.categorie.name || '';
      if (name) {
        console.log('Found category from categorie object:', name);
        return name;
      }
    }

    if (product.category && typeof product.category === 'object' && product.category !== null) {
      const name = product.category.nom || product.category.name || product.category.libelle || '';
      if (name) {
        console.log('Found category from category object:', name);
        return name;
      }
    }

    if (product.category && typeof product.category === 'string' && product.category.trim() !== '') {
      const numId = parseInt(product.category);
      if (!isNaN(numId) && numId > 0 && this.categories.length > 0) {
        const category = this.categories.find(cat => cat.id === numId);
        if (category) {
          console.log(`Found category by string ID ${numId}:`, category.nom);
          return category.nom;
        }
      }
      if (product.category.trim() !== '') {
        return product.category;
      }
    }

    if (product.categorie) {
      if (typeof product.categorie === 'string' && product.categorie.trim() !== '') {
        const numId = parseInt(product.categorie);
        if (!isNaN(numId) && numId > 0 && this.categories.length > 0) {
          const category = this.categories.find(cat => cat.id === numId);
          if (category) {
            console.log(`Found category by categorie string ID ${numId}:`, category.nom);
            return category.nom;
          }
        }
        return product.categorie;
      }
      if (typeof product.categorie === 'number' && product.categorie > 0 && this.categories.length > 0) {
        const category = this.categories.find(cat => cat.id === product.categorie);
        if (category) {
          console.log(`Found category by categorie number ID ${product.categorie}:`, category.nom);
          return category.nom;
        }
      }
    }

    console.log('No category found. Product keys:', Object.keys(product));
    return '';
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.fetchProducts();
    });
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  addProduct(): void {
    this.router.navigate(['/products/new']);
  }

  getCategoryName(product: Produit): string {
    if (!product.categorie) return '';
    if (typeof product.categorie === 'object' && product.categorie !== null) {
      return (product.categorie as Categorie).nom;
    }
    return product.categorie.toString();
  }

  searchProducts(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter(product =>
      product.nom.toLowerCase().includes(term) ||
      this.getCategoryName(product).toLowerCase().includes(term) ||
      product.id.toString().includes(term)
    );
  }

}
