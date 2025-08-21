package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    long countByRol(String rol);
}
