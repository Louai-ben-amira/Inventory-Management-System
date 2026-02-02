package MyApp.GestionInvent.controller;


import MyApp.GestionInvent.model.Produit;
import MyApp.GestionInvent.service.ProduitService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Getter
@Setter
@RequestMapping("/api/produits")
@CrossOrigin(origins = "http://localhost:4200")
public class ProduitController {
    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @PostMapping
    public ResponseEntity<Produit> create(@RequestBody Produit p) {
        return ResponseEntity.ok(produitService.create(p));
    }

    @GetMapping
    public List<Produit> list() { return produitService.list(); }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> get(@PathVariable Long id) {
        return produitService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> update(@PathVariable Long id, @RequestBody Produit p) {
        try {
            return ResponseEntity.ok(produitService.update(id, p));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Produit> search(@RequestParam String q) {
        return produitService.searchByName(q);
    }

    @GetMapping("/low-stock")
    public List<Produit> lowStock(@RequestParam(defaultValue = "5") int threshold) {
        return produitService.lowStock(threshold);
    }
}
