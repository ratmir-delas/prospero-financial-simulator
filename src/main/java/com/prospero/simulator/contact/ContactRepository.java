package com.prospero.simulator.contact;

import com.prospero.simulator.calculation.Calculation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Integer> {

}
