package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.repository.CompraRepository;
import com.sbr.sabor_bajo_el_radar.repository.NegocioRepository;
import com.sbr.sabor_bajo_el_radar.repository.PqrRepository;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    //Inyecciones de los repositorios
    @Autowired
    private UsuarioRepository usuariorp;

    @Autowired
    private NegocioRepository negociorp;

    @Autowired
    private CompraRepository comprarp;

    @Autowired
    private PqrRepository pqrrp;

    // Este metodo devuelve un Map con las estadisticas clave para las tarjetas del dashboard
    public Map<String, Object> resumenDashboard() {

        Map<String, Object> resumen = new HashMap<>();

        //------------------------------------

        /* Cantidad total de usuarios, se usa count() por la funcion prederteminada de los jpa.
         * Y se agrega al Map */
        long totalUsuarios = usuariorp.count();
        resumen.put("totalUsuarios", totalUsuarios);

        //------------------------------------

        /*
            - Se llama la funcion countEstadoNegocio() para conocer los negocios activo y aprobados
            - Luego se usa streams para procesar la coleccion, filter para quedarse con los dos valores, maptolong convierte la entidad y la suma
            - Por ultimo se almacena en resumen
        */
        List<Object[]> negocios = negociorp.countEstadosNegocio();
        long activos = negocios.stream()
                .filter(n -> "activo".equals(n[0]) && "aprobado".equals(n[1]))
                .mapToLong(n -> ((Number) n[2]).longValue()).sum();
        resumen.put("negociosActivos", activos);

        // -----------------------------------

        /*
            - Cantidad de total de ventas
            - Se almacena en resumen
        */

        Double totalVentas = comprarp.totalVentas();
        resumen.put("ventasTotales", totalVentas != null ? totalVentas : 0.0);

        // ------------------------------------

        /*
            - Se llama la funcion countEstadoNegocio() para conocer los negocios activo y aprobados
            - Luego se usa streams para procesar la coleccion, filter para quedarse con los dos valores, maptolong convierte la entidad y la suma
            - Por ultimo se almacena en resumen
        */
        List<Object[]> pqrs = pqrrp.pqrsPorEstados();

        long pendientes = pqrs.stream()
                .filter(p -> "pendiente".equals(p[0]) || "en_revision".equals(p[0]))
                .mapToLong(p -> ((Number) p[1]).longValue())
                .sum();
        resumen.put("pendientesTotales", pendientes);

        // -----------------------------------

        /*
            - Cantidad de total de compras realizadas
            - Se almacena en resumen
        */

        long compras = comprarp.comprasRealizadas();
        resumen.put("comprasRealizadas", compras);

        // --------------------------------------

        /*
            - Cantidad de negocios pendientes por verificar
            - Se almacena en resumen
        */
        long nPendientes = negociorp.negociosPendiente();
        resumen.put("negociosPendiente", nPendientes);

        //-------------------------------------------

        //Retorna el Map
        return resumen;

    }

    // 1. Contar los usuarios por sus roles
    public Map<String, Long> usuariosPorRol() {

        //Se crea una lista de objetos, la cual se llama el repositorio
        List<Object[]> datos = usuariorp.countRol();

        //Se crea una variable de Map donde se va a guardar los resultados
        Map<String, Long> resultado = new HashMap<>();

        // Se crea una iteracion la cual fila va a recorrer de datos, entonces fila tendra dos columnas que seria rol y cantidad
        for (Object[] fila : datos) {

            //Convierte el primer valor de la fila a texto, seria rol
            String rol = fila[0].toString();

            //Convierte el segundo valor (cantidad) a numero largo por si viene con diferente tipo de dato numerico
            Long cantidad = ((Number) fila[1]).longValue();

            //Guarda ese par en el mapa, la cual seria el rol como clave y la cantidad como valor
            resultado.put(rol, cantidad);
        }

        //Devuelve el mapa completo
        return resultado;
    }

    // 2. Negocios por estado y aprobación (gráfico de barras)
    // Se crea un metood que devuelve una lista de mapas. Cada mapa tendra: Estado, aprobacion y cantidad
    public List<Map<String, Object>> negociosPorEstadoYAprobacion() {

        //Llama al repositorio para obetner una lista ed filas, cada fila tiene 3 columnas: cantidad, aprobado y cantidad
        List<Object[]> datos = negociorp.countEstadosNegocio();

        //Crea una lista vacia donde se guardara los mapas con los datos
        List<Map<String, Object>> resultado = new ArrayList<>();

        //Itera cada fila de los datos
        for (Object[] fila : datos) {

            // Se crea un mapa vacia para guardar los datos de la fila
            Map<String, Object> item = new HashMap<>();

            //Guarda el estado del negocio como activo, pendiente
            item.put("estado", fila[0]);

            //Guarda si el negocio esta aprobado o no
            item.put("aprobado", fila[1]);

            // Convierte la cantidad a numero largo y la guarda
            item.put("cantidad", ((Number) fila[2]).longValue());

            //agrega el mapa a la lista final
            resultado.add(item);
        }

        //Devuelve la lista completa
        return resultado;
    }

    // 3. Ventas por mes (gráfico de línea)
    // Declara un metodo que devuelve un mapa cada mes, tendra el total vendido
    public Map<String, Double> ventasPorMes() {

        //Llama al repositorio para obtener una lista de filas, cada fila tendra dos columna: mes y total
        List<Object[]> datos = comprarp.ventasPorMes();

        //Crea un mapa vacio ára guardar los resultados
        Map<String, Double> resultado = new HashMap<>();

        //Itera cada fila
        for (Object[] fila : datos) {

            //Convierte el numero del mes en texto como (mes 1, mes 2)
            String mes = "Mes " + fila[0];

            // Convierte el total vendido a numero decimal double
            Double total = ((Number) fila[1]).doubleValue();

            //Guarda el par en el mapa como (mes 1 => 1200.50)
            resultado.put(mes, total);
        }

        // Devuelve el mapa completo
        return resultado;
    }

    // 4. PQRS por estado (gráfico de barras)
    // Declara un metodo que devuelve un mapa: cada estado(string) y tendra su cantidad (long)
    public Map<String, Long> pqrsPorEstado() {

        // Llama al repositorio para obtener una lista de filas, cada fila tendra dos columna estado y cantidad
        List<Object[]> datos = pqrrp.pqrsPorEstados();

        //Crea un mapa vacio para guardar los resultados
        Map<String, Long> resultado = new HashMap<>();

        //Itera cada fila
        for (Object[] fila : datos) {

            //Convierte el estado a texto
            String estado = fila[0].toString();

            // Convierte la cantidad a numero largo
            Long cantidad = ((Number) fila[1]).longValue();

            // Guardar el par en el mapa
            resultado.put(estado, cantidad);
        }

        // Devuelve el mapa completo
        return resultado;
    }


}
