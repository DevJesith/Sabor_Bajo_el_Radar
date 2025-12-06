package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.MetodoPagoDTO;
import com.sbr.sabor_bajo_el_radar.model.MetodoPago;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.MetodoPagoRepository;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MetodoPagoService {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<MetodoPago> listarPorUsuario(String email) {
        return metodoPagoRepository.findByUsuarioCorreo(email);
    }

    @Transactional
    public MetodoPago guardar(MetodoPagoDTO dto, String email) {
        Usuario usuario = usuarioRepository.findByCorreo(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MetodoPago metodo = new MetodoPago();
        metodo.setUsuario(usuario);
        metodo.setTipo(dto.getTipo());
        metodo.setTitular(dto.getTitular());

        if ("TARJETA".equals(dto.getTipo())) {
            String num = dto.getNumero();
            String ultimos4 = num.length() > 4 ? num.substring(num.length() - 4) : num;
            metodo.setNumeroMascara("**** **** **** " + ultimos4);
            metodo.setFranquicia(dto.getFranquicia());
            metodo.setFechaVencimiento(dto.getFechaVencimiento());
        } else {
            metodo.setNumeroMascara(dto.getNumero());
            metodo.setFranquicia(dto.getTipo());
            metodo.setFechaVencimiento(null);
        }
        return metodoPagoRepository.save(metodo);

    }

    @Transactional
    public void eliminar(Long id, String email) {
        MetodoPago metodo = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metodo no encontrado"));

        // Seguridad: Verificar que el método pertenece al usuario logueado
        if (!metodo.getUsuario().getCorreo().equals(email)) {
            throw new SecurityException("NO TIENES PERMISO PARA ELIMINAR ESTE METODO");
        }
        metodoPagoRepository.deleteById(id);
    }
}
