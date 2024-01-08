package com.prospero.simulator.calculation;

import com.prospero.simulator.user.User;
import com.prospero.simulator.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(path = "/api/v1/calculation")
public class CalculationController {

    private final CalculationService calculationService;

    @Autowired
    public CalculationController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @GetMapping("/user/{userId}")
    public List<Calculation> getCalculationsByUserId(@PathVariable Integer userId) {
        return calculationService.getAllCalculationsByUserId(userId);
    }

    @GetMapping("/{id}")
    public Calculation getCalculation(@PathVariable Integer id) {
        return calculationService.getCalculation(id);
    }

    @GetMapping("/")
    public List<Calculation> getCalculations() {
        return calculationService.getAllCalculations();
    }

    @GetMapping("/count/{userId}")
    public int countByUserId(@PathVariable Integer userId) {
        return calculationService.countByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCalculation(@PathVariable Integer id) {
        calculationService.deleteCalculation(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<?> createCalculation(@RequestBody Calculation calculation) {
        // Logic to save the calculation
        Calculation savedCalculation = calculationService.saveCalculation(calculation);
        return ResponseEntity.ok(savedCalculation);
    }


//    @GetMapping("/update/{id}")
//    public void updateCalculation(@PathVariable Integer id) {
//        Calculation calculation = calculationService.getCalculation(id);
//        calculation.setName("Updated name");
//        calculationService.updateCalculation(id, calculation);
//    }

}
