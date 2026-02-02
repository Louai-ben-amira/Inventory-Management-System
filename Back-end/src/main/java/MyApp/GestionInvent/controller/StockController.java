package MyApp.GestionInvent.controller;

import MyApp.GestionInvent.model.StockMouvement;
import MyApp.GestionInvent.repository.StockMouvementRepository;
import MyApp.GestionInvent.service.StockService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Getter
@Setter

@RequestMapping("/api/stock")
@CrossOrigin(origins = "http://localhost:4200")
public class StockController {
    private final StockService stockService;
    private final StockMouvementRepository stockRepo;

    public StockController(StockService stockService, StockMouvementRepository stockRepo) {
        this.stockService = stockService;
        this.stockRepo = stockRepo;
    }

    @PostMapping("/movement")
    public ResponseEntity<StockMouvement> createMovement(@RequestBody StockMouvement m) {
        try {
            return ResponseEntity.ok(stockService.registerMovement(m));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/movements")
    public List<StockMouvement> listMovements() { return stockRepo.findAll(); }

    @GetMapping("/movements/{produitId}")
    public List<StockMouvement> movementsForProduit(@PathVariable Long produitId) {
        return stockRepo.findByProduitId(produitId);
    }
}
