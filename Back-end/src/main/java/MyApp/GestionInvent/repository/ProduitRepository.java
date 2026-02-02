package MyApp.GestionInvent.repository;


import MyApp.GestionInvent.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByNomContainingIgnoreCase(String nom);
    List<Produit> findByQuantiteLessThan(Integer threshold);
}
