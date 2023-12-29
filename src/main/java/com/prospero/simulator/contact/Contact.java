package com.prospero.simulator.contact;

import com.prospero.simulator.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="_contact")
public class Contact {

    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String message;
    private Long createdAt;
    @Enumerated(EnumType.STRING)
    private ContactState state;
    @ManyToOne
    @JoinColumn
    private User resolvedBy;
}
