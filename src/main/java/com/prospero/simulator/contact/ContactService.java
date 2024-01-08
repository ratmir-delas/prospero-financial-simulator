package com.prospero.simulator.contact;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Contact getContact(Integer id) {
        return contactRepository.findById(id).orElse(null);
    }

    public boolean isContactStored(Contact contact) {
        return contactRepository.existsById(contact.getId());
    }

    public void addContact(Contact contact) {
        contactRepository.save(contact);
    }

    public void deleteContact(Integer id) {
        contactRepository.deleteById(id);
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
}
