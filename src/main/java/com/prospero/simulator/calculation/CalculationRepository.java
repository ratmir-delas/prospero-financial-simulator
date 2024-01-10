package com.prospero.simulator.calculation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CalculationRepository extends JpaRepository<Calculation, Integer> {

    @Query("SELECT c FROM Calculation c WHERE c.createdBy.id = ?1")
    List<Calculation> findByUserId(Integer userId);

    @Query("SELECT COUNT(c) FROM Calculation c WHERE c.createdBy.id = ?1")
    int countByUserId(Integer userId);
}
