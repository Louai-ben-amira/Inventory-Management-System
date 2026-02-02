package MyApp.GestionInvent.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class StockMouvement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime date;
    private String type; // "IN" or "OUT"
    private Integer quantite;

    @ManyToOne
    @JoinColumn(name = "produit_id")
    private Produit produit;


}
