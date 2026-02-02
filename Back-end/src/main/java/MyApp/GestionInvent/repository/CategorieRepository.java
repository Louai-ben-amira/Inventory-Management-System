package MyApp.GestionInvent.repository;


import MyApp.GestionInvent.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {}
