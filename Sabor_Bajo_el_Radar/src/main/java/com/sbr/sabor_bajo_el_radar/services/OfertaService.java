package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.OfertaDTO;
import com.sbr.sabor_bajo_el_radar.model.Oferta;

import java.util.List;
import java.util.Optional;

public interface OfertaService {
    /**
     * Encuentra todas las ofertas de un vendedor.
     *
     * @param email El email del usuario vendedor autenticado.
     * @return Una lista de sus ofertas.
     */
    List<Oferta> findAllByVendedorEmail(String email);

    /**
     * Guarda una nueva oferta, validando que el producto asociado pertenezca al vendedor.
     *
     * @param ofertaDTO El DTO con los datos de la oferta.
     * @param email     El email del usuario vendedor autenticado.
     * @return La oferta guardada.
     */
    Oferta save(OfertaDTO ofertaDTO, String email);

    /**
     * Actualiza una oferta existente.
     *
     * @param id        El ID de la oferta a actualizar.
     * @param ofertaDTO El DTO con los nuevos datos.
     * @param email     El email del vendedor para validar la propiedad.
     * @return Un Optional con la oferta actualizada.
     */
    Optional<Oferta> update(Long id, OfertaDTO ofertaDTO, String email);

    /**
     * Busca una oferta por su ID, asegurándose de que pertenezca al vendedor.
     *
     * @param id    El ID de la oferta.
     * @param email El email del vendedor.
     * @return Un Optional que contiene la oferta si se encuentra y le pertenece.
     */
    Optional<Oferta> findByIdAndVendedorEmail(Long id, String email);

    /**
     * Elimina una oferta por su ID, validando la propiedad.
     *
     * @param id    El ID de la oferta a eliminar.
     * @param email El email del vendedor.
     * @return true si se eliminó, false si no.
     */
    boolean deleteByIdAndVendedorEmail(Long id, String email);
}