package com.sbr.sabor_bajo_el_radar.services.impl;

import com.sbr.sabor_bajo_el_radar.dtos.NegocioDTO;
import com.sbr.sabor_bajo_el_radar.model.Negocio;
import com.sbr.sabor_bajo_el_radar.model.Vendedor;
import com.sbr.sabor_bajo_el_radar.repository.NegocioRepository;
import com.sbr.sabor_bajo_el_radar.repository.VendedorRepository;
import com.sbr.sabor_bajo_el_radar.services.NegocioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class NegocioServiceImpl implements NegocioService {

    @Autowired
    private NegocioRepository negocioRepository;

    @Autowired
    private VendedorRepository vendedorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Negocio> findAllByVendedorEmail(String email) {
        return vendedorRepository.findByUsuarioCorreo(email)
                .map(vendedor -> negocioRepository.findByVendedorId(vendedor.getId()))
                .orElse(Collections.emptyList());
    }

    @Override
    @Transactional
    public Negocio save(NegocioDTO negocioDTO, String email) {
        Vendedor vendedor = vendedorRepository.findByUsuarioCorreo(email)
                .orElseThrow(() -> new UsernameNotFoundException("Vendedor no encontrado con email: " + email));

        Negocio negocio = new Negocio();
        negocio.setVendedor(vendedor);
        negocio.setNombreNegocio(negocioDTO.getNombreNegocio());
        negocio.setDescripcionNegocio(negocioDTO.getDescripcionNegocio());
        negocio.setUbicacionNegocio(negocioDTO.getUbicacionNegocio());

        // --- LÍNEA CLAVE ---
        // Asigna el nombre del propietario basándose en el usuario autenticado.
        String propietario = vendedor.getUsuario().getNombres() + " " + vendedor.getUsuario().getApellidos();
        negocio.setPropietarioNegocio(propietario);

        negocio.setTipoNegocio(negocioDTO.getTipoNegocio());
        negocio.setEmailNegocio(negocioDTO.getEmailNegocio());
        negocio.setEstadoNegocio(negocioDTO.getEstadoNegocio() != null ? negocioDTO.getEstadoNegocio() : "inactivo");
        negocio.setImagenUrl(negocioDTO.getImagenUrl());
        negocio.setEstaLegalizado("no");

        return negocioRepository.save(negocio);
    }

    @Override
    @Transactional
    public Optional<Negocio> update(Long id, NegocioDTO negocioDTO, String email) {
        return findByIdAndVendedorEmail(id, email)
                .map(negocio -> {
                    negocio.setNombreNegocio(negocioDTO.getNombreNegocio());
                    negocio.setDescripcionNegocio(negocioDTO.getDescripcionNegocio());
                    negocio.setUbicacionNegocio(negocioDTO.getUbicacionNegocio());
                    negocio.setTipoNegocio(negocioDTO.getTipoNegocio());
                    negocio.setEmailNegocio(negocioDTO.getEmailNegocio());
                    negocio.setEstadoNegocio(negocioDTO.getEstadoNegocio());
                    negocio.setImagenUrl(negocioDTO.getImagenUrl());
                    return negocioRepository.save(negocio);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Negocio> findByIdAndVendedorEmail(Long id, String email) {
        return negocioRepository.findById(id)
                .filter(negocio -> negocio.getVendedor().getUsuario().getCorreo().equals(email));
    }

    @Override
    @Transactional
    public boolean deleteByIdAndVendedorEmail(Long id, String email) {
        if (findByIdAndVendedorEmail(id, email).isPresent()) {
            negocioRepository.deleteById(id);
            return true;
        }
        return false;
    }
}