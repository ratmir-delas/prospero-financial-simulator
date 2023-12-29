package com.prospero.simulator.calculation;

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
@Table(name="_calculation")
public class Calculation {
    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String description;
    private String initialAmount;
    private String contributionAmount;
    @Enumerated(EnumType.STRING)
    private ContributionFrequency contributionFrequency;
    @Enumerated(EnumType.STRING)
    private CapitalizationFrequency capitalizationFrequency;
    private Integer durationYears;
    private String interestRate;
    private String inflationRate;
    private String incomeTaxRate;
    private Double inflatedPercentage;
    private Double finalAmount;
    private Long createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private User createdBy;
}
