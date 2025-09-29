package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Integer> {

    @Query("""
                SELECT dc.producto.categoria, SUM(dc.cantidad * dc.precioUnitario)
                FROM DetalleCompra dc
                GROUP BY dc.producto.categoria
            """)
    List<Object[]> sumarIngresosPorCategoria();
}