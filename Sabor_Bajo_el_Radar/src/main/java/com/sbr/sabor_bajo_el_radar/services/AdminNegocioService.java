package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.model.Negocio;

import java.util.List;

public interface AdminNegocioService {
    List<Negocio> getAllNegocios();

    Negocio aprobarNegocio(Long negocioId, String adminEmail);

    Negocio rechazarNegocio(Long negocioId, String motivo, String adminEmail);
}
