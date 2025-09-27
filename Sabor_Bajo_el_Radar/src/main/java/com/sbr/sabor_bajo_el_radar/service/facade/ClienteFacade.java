package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Cliente;
import com.sbr.sabor_bajo_el_radar.repository.ClienteRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.ClienteFacadeLocal;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ClienteFacade implements ClienteFacadeLocal {

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public Cliente create(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente edit(Cliente cliente) {
        if (cliente.getId() == null || !clienteRepository.existsById(cliente.getId())) {
            throw new IllegalArgumentException("El cliente no existe");
        }
        return clienteRepository.save(cliente);
    }

    @Override
    public void remove(Integer id) {
        if (!clienteRepository.existsById(id)) {
            throw new IllegalArgumentException("El cliente no existe");
        }
        clienteRepository.deleteById(id);
    }

    @Override
    public Cliente find(Integer id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @Override
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    @Override
    public List<Cliente> findRange(int start, int end) {
        List<Cliente> clientes = clienteRepository.findAll();
        if (start < 0) start = 0;
        if (end > clientes.size()) end = clientes.size();
        return clientes.subList(start, end);
    }

    @Override
    public long count() {
        return clienteRepository.count();
    }
}
