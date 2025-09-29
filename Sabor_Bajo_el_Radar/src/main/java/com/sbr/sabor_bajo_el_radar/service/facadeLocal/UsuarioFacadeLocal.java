package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Usuario;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UsuarioFacadeLocal {

    Usuario create(Usuario usuario);

    Usuario edit(Usuario usuario);

    void remove(Integer id);

    Optional<Usuario> find(Integer id);

    List<Usuario> findAll();

    long count();

    Map<String, Long> contarUsuariosPorRol();
}
