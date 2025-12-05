package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Negocio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NegocioRepository extends JpaRepository<Negocio, Long> {

    // Encuentra todos los negocios ordenados por estado (pendiente primero)
    @Query("SELECT n FROM Negocio n LEFT JOIN FETCH n.vendedor v LEFT JOIN FETCH v.usuario ORDER BY " +
            "CASE n.estado " +
            "WHEN 'pendiente' THEN 1 " +
            "WHEN 'rechazado' THEN 2 " +
            "WHEN 'aprobado' THEN 3 " +
            "ELSE 4 END")
    List<Negocio> findAllByOrderByAprobadoAsc();

    // Encuentra negocios por vendedor
    List<Negocio> findByVendedorId(Long vendedorId);

    // Encuentra negocios por estado de aprobación
    List<Negocio> findByEstado(String estado);

    // Encuentra negocios activos y aprobados
    List<Negocio> findByEstadoNegocioAndEstado(String estadoNegocio, String aprobado);

    @Query("SELECT n.estadoNegocio, n.estado, COUNT(n) FROM Negocio n GROUP BY n.estadoNegocio, n.estado")
    List<Object[]> countEstadosNegocio();

    @Query("SELECT COUNT(n) FROM Negocio n WHERE n.estado = 'pendiente'")
    long negociosPendiente();

//    List<Negocio> findByVendedorId(Long vendedorId);

    Optional<Negocio> findById(Long id);
}