package MyApp.GestionInvent.service;

import MyApp.GestionInvent.model.Produit;
import MyApp.GestionInvent.model.StockMouvement;
import MyApp.GestionInvent.repository.ProduitRepository;
import MyApp.GestionInvent.repository.StockMouvementRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class StockService {
    private final StockMouvementRepository stockRepo;
    private final ProduitRepository produitRepo;

    public StockService(StockMouvementRepository stockRepo, ProduitRepository produitRepo) {
        this.stockRepo = stockRepo;
        this.produitRepo = produitRepo;
    }

    /**
     * Register stock movement and update product quantity.
     * type: "IN" or "OUT"
     */
    public StockMouvement registerMovement(StockMouvement m) {
        Produit p = produitRepo.findById(m.getProduit().getId())
                .orElseThrow(() -> new RuntimeException("Produit not found"));
        if (m.getType().equalsIgnoreCase("IN")) {
            p.setQuantite((p.getQuantite() == null ? 0 : p.getQuantite()) + m.getQuantite());
        } else if (m.getType().equalsIgnoreCase("OUT")) {
            int current = p.getQuantite() == null ? 0 : p.getQuantite();
            if (m.getQuantite() > current) throw new RuntimeException("Not enough stock");
            p.setQuantite(current - m.getQuantite());
        } else {
            throw new RuntimeException("Invalid movement type");
        }
        produitRepo.save(p);
        m.setDate(LocalDateTime.now());
        return stockRepo.save(m);
    }
}
