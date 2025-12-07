package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    //Buscar un cliente por el ID de su usuario asociado
    Optional<Cliente> findByUsuarioId(Integer usuarioid);
}