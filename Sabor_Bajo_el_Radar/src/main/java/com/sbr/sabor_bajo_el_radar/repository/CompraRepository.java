package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

//Importa la interfaz base de Spring Data JPA. Al extender JpaRepository, esta interfaz hereda metodos como finAll(), save(), delete(), count(), etc.

// Se crea una interfaz que extiende JpaRepository para la entidad Compra.
// El tipo Integer indica que el ID de Compra es un numero entero.
public interface CompraRepository extends JpaRepository<Compra, Integer> {

    // Ejecuta una consulta JPQL que: extrae el numero del mes desde la fecha de cada compra, suma el total de compras por mes, agrupa los resultados por mes
    @Query("SELECT MONTH(c.fecha), SUM(c.total) FROM Compra c GROUP BY MONTH(c.fecha)")

    /*Devuelve una lista de arreglos Object[] donde cada arreglo tiene:
        - Objecto[0]: numero del mes
        - Objecto[1]: suma total de ventas en ese mes
    */
    List<Object[]> ventasPorMes();

    // Suma todos los valores de la columna total en la tabla Compra.
    @Query("SELECT SUM(c.total) FROM Compra c")
    // Un numero decimal con el total de ventas realizadas en el sistema.
    Double totalVentas();

    // Cuenta cuantos registros hay en la tabla Compra.
    @Query("SELECT COUNT(c) FROM Compra c")
    // Un numero entero con la cantidad total de compras registradas.
    long comprasRealizadas();
}