package com.prospero.simulator.web;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Locale;

@Controller
@RequestMapping("/locale")
public class LocaleDemoController {

    private final MessageSource messageSource;

    public LocaleDemoController(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @GetMapping
    public String demo() {
        return messageSource.getMessage("common.hello", null, LocaleContextHolder.getLocale());
    }

    @GetMapping("/with-header")
    public String sayHello(
            @RequestHeader(name = "Accept-Language", required = false)
            Locale locale
    ) {
        LocaleContextHolder.setLocale(locale);
        return messageSource.getMessage("common.hello", null, locale);
    }
}
