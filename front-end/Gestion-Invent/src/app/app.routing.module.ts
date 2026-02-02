import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { StockMovementListComponent } from './components/stock-movements/stock-movement-list/stock-movement-list.component';
import { StockMovementFormComponent } from './components/stock-movements/stock-movement-form/stock-movement-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  // Product routes
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },

  // Category routes (ADMIN only)
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'categories/new',
    component: CategoryFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'categories/edit/:id',
    component: CategoryFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },

  // Stock movement routes
  // Both ADMIN and USER can view and add stock movements (updating stock levels).
  {
    path: 'stock-movements',
    component: StockMovementListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stock-movements/new',
    component: StockMovementFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stock-movements/edit/:id',
    component: StockMovementFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
