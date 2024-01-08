package com.prospero.simulator.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping(path = "/api/v1/contacts")
public class ContactController {

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping("/")
    public List<Contact> getContacts() {
        return contactService.getAllContacts();
    }

    @GetMapping("/{id}")
    public Contact getContact(@PathVariable Integer id) {
        return contactService.getContact(id);
    }

    @GetMapping("/delete/{id}")
    public void deleteContact(@PathVariable Integer id) {
        contactService.deleteContact(id);
    }

    @GetMapping("/add/{id}")
    public void addContact(@PathVariable Integer id) {
        Contact contact = new Contact();
        contact.setId(id);
        contactService.addContact(contact);
    }

    @GetMapping("/update/{id}")
    public void updateContact(@PathVariable Integer id) {
        Contact contact = contactService.getContact(id);
        contact.setName("Updated");
        contactService.addContact(contact);
    }

    @GetMapping("/isStored/{id}")
    public boolean isContactStored(@PathVariable Integer id) {
        Contact contact = contactService.getContact(id);
        return contactService.isContactStored(contact);
    }
}
