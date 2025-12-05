package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.model.Negocio;
import com.sbr.sabor_bajo_el_radar.model.Producto;
import com.sbr.sabor_bajo_el_radar.model.Vendedor;
import com.sbr.sabor_bajo_el_radar.repository.NegocioRepository;
import com.sbr.sabor_bajo_el_radar.repository.ProductoRepository;
import com.sbr.sabor_bajo_el_radar.repository.VendedorRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
public class CargaProductoService {

    // Se llaman los repos
    private final ProductoRepository productoRepository;
    private final NegocioRepository negocioRepository;

    public int importados = 0;
    public int saltados = 0;


    // Metodo constructor
    public CargaProductoService(ProductoRepository productoRepository, NegocioRepository negocioRepository) {
        this.productoRepository = productoRepository;
        this.negocioRepository = negocioRepository;
    }


    // MAp para recorrer el archivo
    public Map<String, Object> importarProductos(MultipartFile archivo) {
        Map<String, Object> resultado = new HashMap<>();

        // Se debe reiniciar el contador para iniciar de cero por cada archivo que suba
        importados = 0;
        saltados = 0;

        // Logica
        try (XSSFWorkbook workbook = new XSSFWorkbook(archivo.getInputStream())) {

            Sheet hoja = workbook.getSheetAt(0);

            // Seguir con el flujo

            // Recorrer archivo Excel
            for (int i = 1; i <= hoja.getLastRowNum(); i++) {
                Row fila = hoja.getRow(i);

                if (fila == null) continue;

                // Leer valores del Excel

//                1. El Id del vendedor
                int negocioId = (int) fila.getCell(6).getNumericCellValue();

//                2. el nombre del producto
                String nombre = fila.getCell(1).getStringCellValue();

//                3. La descripcion del producto
                String descripcion = fila.getCell(2).getStringCellValue();

//                4. El precio del producto Se convierte en String y luego en BigDecimal
                double precioDouble = fila.getCell(3).getNumericCellValue();
                BigDecimal precio = new BigDecimal(String.valueOf(precioDouble));

//                5. El Stock
                int stock = (int) fila.getCell(4).getNumericCellValue();

//                6. La categoria
                String categoria = fila.getCell(5).getStringCellValue();

                // CAMBIAR POR NEGOCIOID
                Optional<Negocio> negocioOpt = negocioRepository.findById((long) negocioId);

                if (negocioOpt.isEmpty()) {
                    // si no existe, se salta fila
                    saltados++;
                    continue;
                }

                Negocio negocio = negocioOpt.get();

                // Se crea el producto
                Producto producto = new Producto();

                producto.setNegocio(negocio);
                producto.setNombre(nombre);
                producto.setDescripcion(descripcion);
                producto.setPrecio(precio);
                producto.setStock(stock);
                producto.setCategoria(categoria);

                productoRepository.save(producto);
                importados++;

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        String mensaje = "Importacion completa: " + importados + " Productos importados, " + saltados + " Productos saltados ";

        resultado.put("mensaje", mensaje);

        return resultado;
    }
}

