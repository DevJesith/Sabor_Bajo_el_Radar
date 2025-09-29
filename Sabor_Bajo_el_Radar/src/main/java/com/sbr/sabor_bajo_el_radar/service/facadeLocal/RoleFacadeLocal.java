package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Role;

import java.util.List;
import java.util.Optional;

public interface RoleFacadeLocal {
    Role save(Role role);

    Optional<Role> findById(Integer id);

    List<Role> findAll();

    void deleteById(Integer id);

    //Optional<Role> findByNombre(String nombre);
}
