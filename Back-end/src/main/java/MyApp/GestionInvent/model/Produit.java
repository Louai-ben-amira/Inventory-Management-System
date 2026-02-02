package MyApp.GestionInvent.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    @Column(length = 1000)
    private String description;
    private Double prix;
    private Integer quantite;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    // convenience method
    public Double getTotalValue() {
        return prix != null && quantite != null ? prix * quantite : 0.0;
    }
}
