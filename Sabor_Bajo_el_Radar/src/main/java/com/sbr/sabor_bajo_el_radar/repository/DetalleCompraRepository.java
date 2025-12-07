package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Integer> {

    //Buicar los detalles basandose en la realcion compraIdCompra y su id
    List<DetalleCompra> findByCompraIdCompraId(Integer compraId);
}