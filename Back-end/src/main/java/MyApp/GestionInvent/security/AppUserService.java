package MyApp.GestionInvent.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository userRepository;
    private final AppRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AppUser registerUser(String username, String rawPassword, Set<String> roleNames) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));

        Set<AppRole> roles = new HashSet<>();
        for (String roleName : roleNames) {
            AppRole role = roleRepository.findByRoleName(roleName)
                    .orElseGet(() -> {
                        AppRole newRole = new AppRole();
                        // Store names like ADMIN / USER; Spring will see ROLE_ prefix in UserDetailsService
                        newRole.setRoleName(roleName);
                        return roleRepository.save(newRole);
                    });
            roles.add(role);
        }

        user.setRoles(roles);
        return userRepository.save(user);
    }

    public Optional<AppUser> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}


