package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

//

public interface DireccionRepository extends JpaRepository<Direccion, Integer> {

    // Consulta JPQL que agrupa todas las direcciones por su campo localidad
    @Query("SELECT d.localidad, COUNT(d) FROM Direccion d GROUP BY d.localidad")

    /* Devuelve una lista de arreglos (Object[]), donde:
        - Object[0] es el nombre de la localidad
        - Object[1] es la cantidad de direcciones en esa localidad.
    */
    List<Object[]> countLocalidad();

}