import { Produit } from './product.model';


export interface StockMouvement {
    id: number;
    quantite: number;
    type: 'IN' | 'OUT';
    date: string | Date;
    produit?: Produit;
    ProduitId?: number;
    userId?: number;
}
