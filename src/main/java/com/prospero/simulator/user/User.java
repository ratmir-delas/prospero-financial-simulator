package com.prospero.simulator.user;

import com.prospero.simulator.calculation.Calculation;
import com.prospero.simulator.contact.Contact;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="_user")
public class User implements UserDetails {

    @Id
    @Column(name="user_id")
    @GeneratedValue
    private Integer id;
    private String email;
    private String password;
    private String defaultLanguage;
    private String defaultCurrency;
    @Enumerated(EnumType.STRING)
    private Role role;
//    @OneToMany(mappedBy="_calculation")
//    private Set<Calculation> calculations;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of((GrantedAuthority) () -> role.name());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
