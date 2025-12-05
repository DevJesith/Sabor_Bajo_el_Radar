package com.sbr.sabor_bajo_el_radar.services.impl;

import com.sbr.sabor_bajo_el_radar.model.Admin;
import com.sbr.sabor_bajo_el_radar.model.Negocio;
import com.sbr.sabor_bajo_el_radar.repository.AdminRepository;
import com.sbr.sabor_bajo_el_radar.repository.NegocioRepository;
import com.sbr.sabor_bajo_el_radar.services.AdminNegocioService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class AdminNegocioServiceImpl implements AdminNegocioService {

    @Autowired
    private NegocioRepository negocioRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Negocio> getAllNegocios() {
        // Ordenamos por estado 'pendiente' primero para que aparezcan arriba en la lista
        return negocioRepository.findAllByOrderByAprobadoAsc();
    }

    @Override
    @Transactional
    public Negocio aprobarNegocio(Long negocioId, String adminEmail) {
        // Buscar el negocio
        Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new EntityNotFoundException("Negocio no encontrado con ID: " + negocioId));

        // Buscar el admin
        Admin admin = adminRepository.findByUsuarioCorreo(adminEmail)
                .orElseThrow(() -> new EntityNotFoundException("Admin no encontrado con email: " + adminEmail));

        // Actualizar el negocio a estado aprobado
        negocio.setEstado("aprobado");
        negocio.setEstadoNegocio("activo");           // Al aprobar, lo activamos automáticamente
        negocio.setFechaAprobacion(Instant.now());    // Registramos la fecha de aprobación
        negocio.setAdmin(admin);                      // Asignamos el admin que aprobó
        negocio.setMotivoRechazo(null);               // Limpiamos cualquier motivo de rechazo previo

        return negocioRepository.save(negocio);
    }

    @Override
    @Transactional
    public Negocio rechazarNegocio(Long negocioId, String motivo, String adminEmail) {
        // Buscar el negocio
        Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new EntityNotFoundException("Negocio no encontrado con ID: " + negocioId));

        // Buscar el admin
        Admin admin = adminRepository.findByUsuarioCorreo(adminEmail)
                .orElseThrow(() -> new EntityNotFoundException("Admin no encontrado con email: " + adminEmail));

        // Actualizar el negocio a estado rechazado
        negocio.setEstado("rechazado");
        negocio.setEstadoNegocio("inactivo");         // Al rechazar, lo mantenemos inactivo
        negocio.setMotivoRechazo(motivo);             // Guardamos el motivo del rechazo
        negocio.setFechaAprobacion(null);             // No hay fecha de aprobación
        negocio.setAdmin(admin);                      // Asignamos el admin que rechazó

        return negocioRepository.save(negocio);
    }
}