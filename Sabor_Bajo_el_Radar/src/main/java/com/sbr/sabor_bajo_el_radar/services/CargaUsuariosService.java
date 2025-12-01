package com.sbr.sabor_bajo_el_radar.services;


import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


// Le decimos a Spring que es un servicio
@Service
public class CargaUsuariosService {

    // se llaman los repos necesarios
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public int importados = 0;
    public int ignorados = 0;

    public CargaUsuariosService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Usaremos map para recorrer el Excel
    public Map<String, Object> importarUsuarios(MultipartFile archivo)
    {
        Map<String, Object> resultado = new HashMap<>();

        // reiniciamos el contador para cada vez que se haga una carga
        importados = 0;
        ignorados = 0;

        // la logica de todo
        // creamos un libro para los datos
        try(XSSFWorkbook workbook = new XSSFWorkbook((archivo.getInputStream())))
        {
            // tomamos la primera hoja del archivo
            Sheet hoja = workbook.getSheetAt(0);

            // Recorremos el archivo
            for (int i = 1; i <= hoja.getLastRowNum(); i++)
            {
                Row fila = hoja.getRow(i);

                // validaciones, si la fila esta vacia se pasa a la otra
                if (fila == null) continue;

                DataFormatter formatter = new DataFormatter();

                // leer los valores
                String nombres = formatter.formatCellValue(fila.getCell(0)).trim();

                String apellidos = formatter.formatCellValue(fila.getCell(1)).trim();

                String documento = formatter.formatCellValue(fila.getCell(2)).trim();

                String telefono = formatter.formatCellValue(fila.getCell(3)).trim();

                String contrasena =  formatter.formatCellValue(fila.getCell(4)).trim();

                String correo = formatter.formatCellValue(fila.getCell(5)).trim();

                String rol = formatter.formatCellValue(fila.getCell(6)).trim().toUpperCase();

                Optional<Usuario> usuarioOpt = usuarioRepository.findByDocumento(documento);

                // mas validaciones, en este caso el documento
                if (usuarioOpt.isPresent())
                {
                    ignorados++;
                    continue;
                }

                if (rol.isEmpty())
                {
                    ignorados++;
                    continue;
                }

                // creamos el usuario
                Usuario usuarioN = new Usuario();

                usuarioN.setNombres(nombres);
                usuarioN.setApellidos(apellidos);
                usuarioN.setDocumento(documento);
                usuarioN.setTelefono(String.valueOf(telefono));
                usuarioN.setCorreo(correo);
                usuarioN.setContrasena(passwordEncoder.encode(contrasena));
                usuarioN.setRol(rol);
                usuarioN.setFechaRegistro(LocalDate.now());

                // Se guardan los usuarios cagados al por mayor
                usuarioRepository.save(usuarioN);
                importados++;

            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        String mensaje = "Importacion Exiosa: " + importados + " Usuarios importados. " + "y " + ignorados + " usuarios ignorados. ";
        resultado.put("mensaje", mensaje);

        return resultado;
    }

}
