import { Categorie } from './category.model';

export interface Produit {
  id: number;
  nom: string;
  categorie: string | Categorie;
  prix: number;
  quantite: number;
  description?: string;
}
