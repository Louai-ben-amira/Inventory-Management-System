import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Categorie } from '../../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Categorie[] = [];

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.categories = data as Categorie[];
        } else if (data && Array.isArray(data.content)) {
          this.categories = data.content as Categorie[];
        } else {
          console.warn('Unexpected categories response shape:', data);
          this.categories = [];
        }
      },
      (error) => {
        console.error('Error fetching categories', error);
        this.categories = [];
      }
    );
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.loadCategories();
    });
  }

  editCategory(id: number): void {
    this.router.navigate(['/categories/edit', id]);
  }

  addCategory(): void {
    this.router.navigate(['/categories/new']);
  }
}
