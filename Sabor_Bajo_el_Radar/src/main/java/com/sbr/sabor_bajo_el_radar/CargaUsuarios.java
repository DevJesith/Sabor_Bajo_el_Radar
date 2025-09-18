package com.sbr.sabor_bajo_el_radar;

import com.opencsv.CSVReader;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

@Component
public class CargaUsuarios implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Intentando cargar datos");

        try (CSVReader reader = new CSVReader(
                new InputStreamReader(getClass().getResourceAsStream("/datosCSV/datos.csv")));
             Connection conexion = DriverManager.getConnection("jdbc:mariadb://localhost:3306/sbr", "root", "")) {

            String[] fila;
            reader.readNext(); // saltar cabecera

            String sql = "INSERT INTO usuarios (nombres, apellidos, documento, telefono, correo, rol_id) " +
                    "VALUES (?, ?, ?, ?, ?, ?) " +
                    "ON DUPLICATE KEY UPDATE " +
                    "nombres = VALUES(nombres), " +
                    "apellidos = VALUES(apellidos), " +
                    "documento = VALUES(documento), " +
                    "telefono = VALUES(telefono), " +
                    "rol_id = VALUES(rol_id)";
            PreparedStatement statement = conexion.prepareStatement(sql);

            while ((fila = reader.readNext()) != null) {
                String rol_id = fila[5].trim().toLowerCase(); // normalizar rol

                // Validar roles permitidos
                if (!(rol_id.equals("1") || rol_id.equals("2") || rol_id.equals("3"))) {
                    System.out.println("Rol inválido: " + fila[0] + " " + fila[1] + " → " + fila[5]);
                    continue; // saltar este registro
                }

                statement.setString(1, fila[0]);
                statement.setString(2, fila[1]);
                statement.setString(3, fila[2]);
                statement.setString(4, fila[3]);
                statement.setString(5, fila[4]);
                statement.setString(6, rol_id);
                statement.executeUpdate();

                System.out.println("usuario registrado ");
            }

            System.out.println("Datos cargados Correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error al cargar datos");
        }
    }
}
