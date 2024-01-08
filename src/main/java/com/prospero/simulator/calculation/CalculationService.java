package com.prospero.simulator.calculation;

import com.prospero.simulator.user.User;
import com.prospero.simulator.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalculationService {

    private final CalculationRepository calculationRepository;
    private final UserRepository userRepository;

    public Calculation getCalculation(Integer id) {
        return calculationRepository.findById(id).orElseThrow();
    }

    public List<Calculation> getAllCalculations() {
        return calculationRepository.findAll();
    }

    public List<Calculation> getAllCalculationsByUserId(Integer userId) {
        return calculationRepository.findByUserId(userId);
    }

    public int countByUserId(Integer userId) {
        return calculationRepository.countByUserId(userId);
    }

    public void deleteCalculation(Integer id) {
        calculationRepository.deleteById(id);
    }

    public Calculation saveCalculation(Calculation calculation) {
        User user = userRepository.findById(calculation.getCreatedBy().getId()).orElseThrow();
        calculation.setCreatedBy(user);
        calculationRepository.save(calculation);
        return calculation;
    }

//    public void updateCalculation(Integer id, Calculation calculation) {
//        Calculation calculationToUpdate = calculationRepository.findById(id).orElseThrow();
//        calculationToUpdate.setName(calculation.getName());
//        calculationToUpdate.setInitialAmount(calculation.getInitialAmount());
//        calculationToUpdate.setContributionAmount(calculation.getContributionAmount());
//        calculationToUpdate.setContributionFrequency(calculation.getContributionFrequency());
//        calculationRepository.save(calculationToUpdate);
//    }
}
