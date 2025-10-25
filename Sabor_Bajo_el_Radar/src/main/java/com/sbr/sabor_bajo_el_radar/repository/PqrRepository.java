package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Pqr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PqrRepository extends JpaRepository<Pqr, Integer> {

    /*
       - Ejecuta una consulta JPQL sobre la entidad Pqr.
       - Agrupa todas las PQRS por su campo estado.

    */
    @Query("SELECT p.estado, COUNT(p) FROM Pqr p GROUP BY p.estado")
    /*
        - Una lista de arreglos (List<Object[]>), donde cada arreglo contiene:
        - Object[0]: el nombre del estado (por ejemplo "pendiente", "en_revision", "resuelta").
        - Object[1]: la cantidad de PQRS que tienen ese estado.
    */
    List<Object[]> pqrsPorEstados();
}