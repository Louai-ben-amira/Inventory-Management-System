package MyApp.GestionInvent.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    private String username;
    private String password;
    // Optional role for registration (e.g. "ADMIN", "Employe")
    private String role;
}


