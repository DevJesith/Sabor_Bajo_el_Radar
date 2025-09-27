package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Compra;
import java.util.List;

public interface CompraFacadeLocal {

    Compra create(Compra compra);

    Compra edit(Compra compra);

    void remove(Integer id);

    Compra find(Integer id);

    List<Compra> findAll();

    List<Compra> findRange(int start, int end);

    long count();
}
