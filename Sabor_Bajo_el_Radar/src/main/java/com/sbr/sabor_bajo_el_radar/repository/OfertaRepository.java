package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OfertaRepository extends JpaRepository<Oferta, Long> {
    List<Oferta> findByProductoNegocioVendedorId(Long vendedorId);

    // --- NUEVO: Para el cliente (Buscar por Negocio y Fechas validas) ---
    @Query("SELECT o FROM Oferta o WHERE o.producto.negocio.id = :negocioId " +
            "AND CURRENT_DATE BETWEEN o.fechaInicio AND o.fechaExpiracion")
    List<Oferta> findCombosActivosPorNegocio(@Param("negocioId") Long negocioId);
}