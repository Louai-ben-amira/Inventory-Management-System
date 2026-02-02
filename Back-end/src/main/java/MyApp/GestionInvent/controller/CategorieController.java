package MyApp.GestionInvent.controller;

import MyApp.GestionInvent.model.Categorie;
import MyApp.GestionInvent.repository.CategorieRepository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Getter
@Setter
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategorieController {
    private final CategorieRepository repo;
    public CategorieController(CategorieRepository repo) { this.repo = repo; }

    @PostMapping public ResponseEntity<Categorie> create(@RequestBody Categorie c){ return ResponseEntity.ok(repo.save(c)); }
    @GetMapping public List<Categorie> list(){ return repo.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Categorie> get(@PathVariable Long id){
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}") public ResponseEntity<Categorie> update(@PathVariable Long id, @RequestBody Categorie c){
        return repo.findById(id).map(existing -> {
            existing.setNom(c.getNom());
            existing.setDescription(c.getDescription());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){ repo.deleteById(id); return ResponseEntity.noContent().build(); }
}
