package MyApp.GestionInvent.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AuthResponse {

    private String token;
    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}


