package MyApp.GestionInvent.controller;

import MyApp.GestionInvent.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final AppUserService appUserService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).build();
        }
    }

        @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest authRequest) {
        // Map incoming role string to internal role name
        String requestedRole = authRequest.getRole();
        String internalRole;
        if (requestedRole == null) {
            internalRole = "USER";
        } else if (requestedRole.equalsIgnoreCase("ADMIN")) {
            internalRole = "ADMIN";
        } else if (requestedRole.equalsIgnoreCase("Employe") || requestedRole.equalsIgnoreCase("EMPLOYE") || requestedRole.equalsIgnoreCase("USER")) {
            internalRole = "USER";
        } else {
            // Fallback: treat unknown roles as USER
            internalRole = "USER";
        }

        try {
            AppUser user = appUserService.registerUser(
                    authRequest.getUsername(),
                    authRequest.getPassword(),
                    Collections.singleton(internalRole)
            );

            // Load UserDetails to build the token (so authorities/roles are included)
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token));
        } catch (RuntimeException ex) {
            // e.g., username already exists
            return ResponseEntity.badRequest().build();
        }
    }
}


