package MyApp.GestionInvent.service;

import MyApp.GestionInvent.model.Produit;
import MyApp.GestionInvent.repository.ProduitRepository;
import MyApp.GestionInvent.repository.StockMouvementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {
    private final ProduitRepository produitRepository;
    private final StockMouvementRepository stockMouvementRepository;

    public ProduitService(ProduitRepository produitRepository,
                          StockMouvementRepository stockMouvementRepository) {
        this.produitRepository = produitRepository;
        this.stockMouvementRepository = stockMouvementRepository;
    }

    public Produit create(Produit p) {
        if (p.getQuantite() == null) p.setQuantite(0);
        return produitRepository.save(p);
    }

    public List<Produit> list() { return produitRepository.findAll(); }

    public Optional<Produit> findById(Long id) { return produitRepository.findById(id); }

    public Produit update(Long id, Produit p) {
        return produitRepository.findById(id).map(existing -> {
            existing.setNom(p.getNom());
            existing.setDescription(p.getDescription());
            existing.setPrix(p.getPrix());
            existing.setQuantite(p.getQuantite());
            existing.setCategorie(p.getCategorie());
            return produitRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Produit not found"));
    }

    public void delete(Long id) {
        // First remove all stock movements linked to this product to avoid FK constraint errors
        stockMouvementRepository.findByProduitId(id)
                .forEach(mouvement -> stockMouvementRepository.deleteById(mouvement.getId()));

        produitRepository.deleteById(id);
    }

    public List<Produit> searchByName(String q) {
        return produitRepository.findByNomContainingIgnoreCase(q);
    }

    public List<Produit> lowStock(int threshold) {
        return produitRepository.findByQuantiteLessThan(threshold);
    }
}
