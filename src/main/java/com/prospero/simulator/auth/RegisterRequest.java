package com.prospero.simulator.auth;

import com.prospero.simulator.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String defaultLanguage;
    private String defaultCurrency;
    private Role role;
}
