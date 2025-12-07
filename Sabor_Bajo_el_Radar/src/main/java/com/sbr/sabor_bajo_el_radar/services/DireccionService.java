package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.DireccionDTO;
import com.sbr.sabor_bajo_el_radar.model.Direccion;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.DireccionRepository;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<DireccionDTO> listarPorUsuario(String email) {
        return direccionRepository.findByUsuarioCorreo(email).stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    @Transactional
    public DireccionDTO guardar(DireccionDTO dto, String email) {
        Usuario usuario = usuarioRepository.findByCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Si marca como predeterminada, desmarcar las otras del usuario
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            List<Direccion> existente = direccionRepository.findByUsuarioCorreo(email);
            existente.forEach(d -> d.setEsPredeterminada((false)));
            direccionRepository.saveAll(existente);
        }

        Direccion dir = new Direccion();
        if (dto.getId() != null) {
            dir = direccionRepository.findById(dto.getId()).orElse(new Direccion());
        }

        dir.setUsuario(usuario);
        dir.setDireccion(dto.getFullAddress());
        dir.setLocalidad(dto.getLocality());
        dir.setEspecificacion(dto.getDetails());
        dir.setEtiqueta(dto.getTag());
        dir.setNombreContacto(dto.getContactName());
        dir.setTelefonoContacto(dto.getContactPhone());
        dir.setLatitud(dto.getLat());
        dir.setLongitud(dto.getLng());
        dir.setEsPredeterminada(dto.getIsDefault());

        //Barrio opcional o calculado
        dir.setBarrio("Bogota");

        Direccion guardada = direccionRepository.save(dir);
        return convertirADTO(guardada);
    }

    @Transactional
    public void eliminar(Long id, String email) {
        Direccion dir = direccionRepository.findById(id).orElseThrow();
        if (dir.getUsuario().getCorreo().equals(email)) {
            direccionRepository.delete(dir);
        }
    }

    private DireccionDTO convertirADTO(Direccion d) {
        DireccionDTO dto = new DireccionDTO();

        dto.setId(d.getId());
        dto.setFullAddress(d.getDireccion());
        dto.setLocality(d.getLocalidad());
        dto.setDetails(d.getEspecificacion());
        dto.setTag(d.getEtiqueta());
        dto.setContactName(d.getNombreContacto());
        dto.setContactPhone(d.getTelefonoContacto());
        dto.setLat(d.getLatitud());
        dto.setLng(d.getLongitud());
        dto.setIsDefault(d.getEsPredeterminada());
        dto.setCity("Bogota");
        return dto;
    }
}
