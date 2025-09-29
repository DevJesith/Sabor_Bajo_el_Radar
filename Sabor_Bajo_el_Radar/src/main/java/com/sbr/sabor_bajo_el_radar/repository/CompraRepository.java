package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Integer> {

    @Query("SELECT FUNCTION('MONTH', c.fecha), SUM(c.total) FROM Compra  c WHERE FUNCTION('YEAR', c.fecha) = :year GROUP BY FUNCTION('MONTH', c.fecha) ")
    List<Object[]> sumarVentasPorMes(int year);

    @Query(value = "SELECT DATE_FORMAT(fecha, '%Y-%m') AS periodo, estado, COUNT(*) AS cantidad " +
            "FROM compra " +
            "GROUP BY DATE_FORMAT(fecha, '%Y-%m'), estado " +
            "ORDER BY DATE_FORMAT(fecha, '%Y-%m')", nativeQuery = true)
    List<Object[]> contarEstadosPorPeriodo();

}
