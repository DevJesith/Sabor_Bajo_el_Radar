package com.sbr.sabor_bajo_el_radar;

import com.opencsv.CSVReader;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

@Component
public class CargaProductos implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Intentando cargar productos...");

        try (CSVReader reader = new CSVReader(
                new InputStreamReader(getClass().getResourceAsStream("/datosCSV/productos.csv")));
             Connection conexion = DriverManager.getConnection("jdbc:mariadb://localhost:3306/sbr", "root", "")) {

            String[] fila;
            reader.readNext(); // saltar cabecera

            // Preparar statements
            String sqlUpdate = "UPDATE producto SET descripcion = ?, categoria = ? WHERE nombre = ?";
            String sqlInsert = "INSERT INTO producto (nombre, descripcion, categoria) VALUES (?, ?, ?)";

            PreparedStatement psUpdate = conexion.prepareStatement(sqlUpdate);
            PreparedStatement psInsert = conexion.prepareStatement(sqlInsert);

            while ((fila = reader.readNext()) != null) {
                // Validar que la fila tenga los 3 campos
                if (fila.length < 3) {
                    System.out.println("Fila incompleta, se salta: " + String.join(",", fila));
                    continue;
                }

                // Limpiar espacios en blanco
                String nombre = fila[0].trim();
                String descripcion = fila[1].trim();
                String categoria = fila[2].trim();

                // Evitar insertar registros vacíos
                if (nombre.isEmpty()) {
                    System.out.println("Producto con nombre vacío, se salta");
                    continue;
                }

                // Intentar actualizar primero
                psUpdate.setString(1, descripcion);
                psUpdate.setString(2, categoria);
                psUpdate.setString(3, nombre);
                int rowsUpdated = psUpdate.executeUpdate();

                // Si no se actualizó ninguno, insertar
                if (rowsUpdated == 0) {
                    psInsert.setString(1, nombre);
                    psInsert.setString(2, descripcion);
                    psInsert.setString(3, categoria);
                    psInsert.executeUpdate();
                }

                System.out.println("Producto insertado/actualizado: " + nombre);
            }

            System.out.println("Productos cargados correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error al intentar cargar productos");
        }
    }
}
