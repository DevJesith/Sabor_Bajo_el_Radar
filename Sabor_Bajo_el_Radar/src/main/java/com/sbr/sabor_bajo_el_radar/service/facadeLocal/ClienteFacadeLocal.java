package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Cliente;
import java.util.List;

public interface ClienteFacadeLocal {

    Cliente create(Cliente cliente);

    Cliente edit(Cliente cliente);

    void remove(Integer id);

    Cliente find(Integer id);

    List<Cliente> findAll();

    List<Cliente> findRange(int start, int end);

    long count();
}
