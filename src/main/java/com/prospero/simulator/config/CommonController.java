package com.prospero.simulator.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Locale;

@Controller
@RequestMapping("/")
public class CommonController {

    @GetMapping()
    public String index(Model model, HttpServletRequest request) {
        Locale locale = request.getLocale();
        model.addAttribute("lang", locale);
        return "index";
    }

    @GetMapping("login")
    public String login(Model model, HttpServletRequest request) {
        Locale locale = request.getLocale();
        model.addAttribute("lang", locale);
        return "login";
    }

    @GetMapping("logout-process")
    public String logout(Model model, HttpServletRequest request) {
        Locale locale = request.getLocale();
        model.addAttribute("lang", locale);
        return "logout";
    }

    @GetMapping("register")
    public String register(Model model, HttpServletRequest request) {
        Locale locale = request.getLocale();
        model.addAttribute("lang", locale);
        return "register";
    }

    @GetMapping("simulator")
    public String simulator(Model model, HttpServletRequest request) {
        Locale locale = request.getLocale();
        model.addAttribute("lang", locale);
        return "simulator";
    }
}
