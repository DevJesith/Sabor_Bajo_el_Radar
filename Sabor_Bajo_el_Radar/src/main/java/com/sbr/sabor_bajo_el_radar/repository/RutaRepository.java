package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RutaRepository extends JpaRepository<Ruta, Integer> {

    //Busca la ruta asociada a una compra especifica
    // Devuelve un solo objeto Ruta (o null si no existe)
    Ruta findByCompraIdCompraId(Integer compraId);
}