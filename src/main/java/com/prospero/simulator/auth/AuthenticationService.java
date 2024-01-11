package com.prospero.simulator.auth;

import com.prospero.simulator.config.JwtService;
import com.prospero.simulator.user.User;
import com.prospero.simulator.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            return null;
        }
        var user = User.builder() // Make changes here in case user parameters updated
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .defaultLanguage(request.getDefaultLanguage())
                .defaultCurrency(request.getDefaultCurrency())
                .role(request.getRole())
                .emailVerified(request.isEmailVerified())
                //.calculations(request.getCalculations())
                .build();
        repository.save(user);
        var token = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .userId(repository.findByEmail(request.getEmail()).orElseThrow().getId())
                .email(user.getEmail())
                .defaultLanguage(user.getDefaultLanguage())
                .defaultCurrency(user.getDefaultCurrency())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        if (repository.findByEmail(request.getEmail()).isEmpty()) {
            return null;
        }
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return null;
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var token = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .defaultLanguage(user.getDefaultLanguage())
                .defaultCurrency(user.getDefaultCurrency())
                .build();
    }

}
