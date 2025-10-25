package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Negocio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NegocioRepository extends JpaRepository<Negocio, Integer> {

    // Ejecuta una consulta JPQL sobre la entidad Negocio.
    // Cuenta cuántos negocios hay en cada combinación de estado y aprobación
    @Query("SELECT n.estadoNegocio, n.aprobado, COUNT(n) FROM Negocio n GROUP BY n.estadoNegocio, n.aprobado")
    /*
        Una lista de arreglos (List<Object[]>), donde cada arreglo contiene:
            - Object[0]: el estado del negocio.
            - Object[1]: el estado de aprobación.
            - Object[2]: la cantidad de negocios en esa combinación.
     */
    List<Object[]> countEstadosNegocio();

    /*

      Ejecuta una consulta JPQL que busca negocios con:
        - estadoNegocio = 'pendiente'
        - aprobado = 'pendiente'
      Cuenta cuántos negocios cumplen ambas condiciones.
    */
    @Query("SELECT COUNT(n) FROM Negocio n WHERE n.estadoNegocio = 'pendiente' AND n.aprobado = 'pendiente'")

    // Un número entero (long) con la cantidad total de negocios que están pendientes de aprobación.
    long negociosPendiente();
}