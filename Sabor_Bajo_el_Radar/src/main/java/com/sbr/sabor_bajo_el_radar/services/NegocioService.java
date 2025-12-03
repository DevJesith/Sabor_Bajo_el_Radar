package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.NegocioDTO;
import com.sbr.sabor_bajo_el_radar.model.Negocio;

import java.util.List;
import java.util.Optional;

public interface NegocioService {

    /**
     * Encuentra todos los negocios que pertenecen a un vendedor, identificado por su email.
     *
     * @param email El email del usuario vendedor autenticado.
     * @return Una lista de sus negocios.
     */
    List<Negocio> findAllByVendedorEmail(String email);

    /**
     * Guarda un nuevo negocio, asociándolo al vendedor autenticado.
     *
     * @param negocioDTO El DTO con los datos del negocio.
     * @param email      El email del usuario vendedor autenticado.
     * @return El negocio guardado.
     */
    Negocio save(NegocioDTO negocioDTO, String email);

    /**
     * Actualiza un negocio existente.
     *
     * @param id         El ID del negocio a actualizar.
     * @param negocioDTO El DTO con los nuevos datos.
     * @param email      El email del vendedor para validar la propiedad.
     * @return Un Optional con el negocio actualizado.
     */
    Optional<Negocio> update(Long id, NegocioDTO negocioDTO, String email);

    /**
     * Busca un negocio por su ID, pero solo si pertenece al vendedor especificado.
     *
     * @param id    El ID del negocio.
     * @param email El email del vendedor para validar la propiedad.
     * @return Un Optional que contiene el negocio si se encuentra y le pertenece.
     */
    Optional<Negocio> findByIdAndVendedorEmail(Long id, String email);

    /**
     * Elimina un negocio por su ID, validando primero que pertenezca al vendedor.
     *
     * @param id    El ID del negocio a eliminar.
     * @param email El email del vendedor.
     * @return true si se eliminó, false si no.
     */
    boolean deleteByIdAndVendedorEmail(Long id, String email);
}