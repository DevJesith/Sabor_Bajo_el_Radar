package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.MuroSocial;

import java.util.List;
import java.util.Optional;

public interface MuroSocialFacadeLocal {

    MuroSocial create(MuroSocial muroSocial);

    MuroSocial update(MuroSocial muroSocial);

    void delete(Integer id);

    Optional<MuroSocial> find(Integer id);

    List<MuroSocial> findAll();
}
