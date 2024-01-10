package com.prospero.simulator.calculation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/calculation/")
public class CalculationController {

    private final CalculationService calculationService;

    @Autowired
    public CalculationController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }
    @GetMapping("user/{id}")
    public List<Calculation> getCalculationsByUserId(@PathVariable Integer id) {
        return calculationService.getAllCalculationsByUserId(id);
    }

    @GetMapping("{id}")
    public Calculation getCalculation(@PathVariable Integer id) {
        return calculationService.getCalculation(id);
    }

    @GetMapping()
    public List<Calculation> getCalculations() {
        System.out.println("getCalculations: " + calculationService.getAllCalculations().size() + " calculations");
        return calculationService.getAllCalculations();
    }

    @GetMapping("count/{userId}")
    public int countByUserId(@PathVariable Integer userId) {
        return calculationService.countByUserId(userId);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteCalculation(@PathVariable Integer id) {
        calculationService.deleteCalculation(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> createCalculation(@RequestBody Calculation calculation) {
        // Logic to save the calculation
        Calculation savedCalculation = calculationService.saveCalculation(calculation);
        return ResponseEntity.ok(savedCalculation);
    }


//    @PutMapping("/update/{id}")
//    public void updateCalculation(@PathVariable Integer id) {
//        Calculation calculation = calculationService.getCalculation(id);
//        calculation.setName("Updated name");
//        calculationService.updateCalculation(id, calculation);
//    }

}
