import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Categorie } from '../../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode: boolean = false;
  categoryId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category: Categorie) => {
        this.categoryForm.patchValue({
          nom: category.nom,
          description: category.description || ''
        });
      },
      error: (error) => {
        this.errorMessage = 'Error loading category: ' + (error.error?.message || error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.categoryForm.value;

      if (this.isEditMode) {
        const category: Categorie = {
          id: this.categoryId!,
          nom: formValue.nom,
          description: formValue.description || ''
        };

        this.categoryService.updateCategory(this.categoryId!, category).subscribe({
          next: () => {
            this.successMessage = 'Category updated successfully!';
            setTimeout(() => {
              this.router.navigate(['/categories']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = 'Error updating category: ' + (error.error?.message || error.message);
            console.error('Error updating category:', error);
          }
        });
      } else {
        const categoryData: Omit<Categorie, 'id'> = {
          nom: formValue.nom,
          description: formValue.description || ''
        };

        this.categoryService.createCategory(categoryData).subscribe({
          next: (createdCategory: Categorie) => {
            this.successMessage = 'Category created successfully!';
            this.categoryForm.reset();
            setTimeout(() => {
              this.router.navigate(['/categories']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = 'Error creating category: ' + (error.error?.message || error.message);
            console.error('Error creating category:', error);
          }
        });
      }
    } else {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }
}
