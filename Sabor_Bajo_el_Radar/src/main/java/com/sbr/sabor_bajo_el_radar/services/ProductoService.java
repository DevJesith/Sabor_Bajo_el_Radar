package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.ProductoDTO;
import com.sbr.sabor_bajo_el_radar.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {
    /**
     * Encuentra todos los productos que pertenecen a un vendedor a través de sus negocios.
     *
     * @param email El email del usuario vendedor autenticado.
     * @return Una lista de todos sus productos.
     */
    List<Producto> findAllByVendedorEmail(String email);

    /**
     * Guarda un nuevo producto, validando que el negocio asociado pertenezca al vendedor.
     *
     * @param productoDTO El DTO con los datos del producto.
     * @param email       El email del usuario vendedor autenticado.
     * @return El producto guardado.
     */
    Producto save(ProductoDTO productoDTO, String email);

    /**
     * Actualiza un producto existente.
     *
     * @param id          El ID del producto a actualizar.
     * @param productoDTO El DTO con los nuevos datos.
     * @param email       El email del vendedor para validar la propiedad.
     * @return Un Optional con el producto actualizado.
     */
    Optional<Producto> update(Long id, ProductoDTO productoDTO, String email);

    /**
     * Busca un producto por su ID, asegurándose de que pertenezca al vendedor.
     *
     * @param id    El ID del producto.
     * @param email El email del vendedor.
     * @return Un Optional que contiene el producto si se encuentra y le pertenece.
     */
    Optional<Producto> findByIdAndVendedorEmail(Long id, String email);

    /**
     * Elimina un producto por su ID, validando la propiedad.
     *
     * @param id    El ID del producto a eliminar.
     * @param email El email del vendedor.
     * @return true si se eliminó, false si no.
     */
    boolean deleteByIdAndVendedorEmail(Long id, String email);
}