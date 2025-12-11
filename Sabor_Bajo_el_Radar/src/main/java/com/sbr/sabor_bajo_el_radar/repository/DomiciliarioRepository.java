package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Domiciliario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DomiciliarioRepository extends JpaRepository<Domiciliario, Integer> {

    Optional<Domiciliario> findByUsuarioId(Integer usuarioId);

}