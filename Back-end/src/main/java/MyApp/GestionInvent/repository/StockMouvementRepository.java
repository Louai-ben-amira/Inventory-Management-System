package MyApp.GestionInvent.repository;



import MyApp.GestionInvent.model.StockMouvement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMouvementRepository extends JpaRepository<StockMouvement, Long> {
    List<StockMouvement> findByProduitId(Long produitId);
}
