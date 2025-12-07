package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.ClienteHomeDTO;
import com.sbr.sabor_bajo_el_radar.model.Negocio;
import com.sbr.sabor_bajo_el_radar.model.Producto;
import com.sbr.sabor_bajo_el_radar.repository.NegocioRepository;
import com.sbr.sabor_bajo_el_radar.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteHomeService {

    @Autowired
    private NegocioRepository negocioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<ClienteHomeDTO.VendorDTO> obtenerNegociosActivos() {
        //1. Obtener negocios aprobados (admin) y activos (vendedor)
        List<Negocio> negocios = negocioRepository.findByEstadoAndEstadoNegocio("aprobado", "activo");
        List<ClienteHomeDTO.VendorDTO> listaDTOs = new ArrayList<>();

        for (Negocio n : negocios) {
            ClienteHomeDTO.VendorDTO dto = new ClienteHomeDTO.VendorDTO();
            dto.setId(n.getId());
            dto.setName(n.getNombreNegocio());
            dto.setCategory(n.getTipoNegocio());

            //Imagen si es null, el front pondra un placeholder, pero enviamos lo que haya
            dto.setImage(n.getImagenUrl());

            dto.setLocation(n.getUbicacionNegocio());

            //Rating simulado (o implementa logica de calificaciones real si tienes tabla)
            dto.setRating(4.5);

            //Descuento simulado (o trae de ofertas si tienes logica)
            dto.setDiscount("");

            // 2. Obtener productos de este negocio
            List<Producto> productos = productoRepository.findByNegocioId(n.getId());

            //Mapear productos a MenuDTO
            List<ClienteHomeDTO.MenuDTO> menu = productos.stream().map(p -> {
                ClienteHomeDTO.MenuDTO m = new ClienteHomeDTO.MenuDTO();
                m.setId(p.getId());
                m.setName(p.getNombre());
                m.setDescription(p.getDescripcion());
                m.setPrice(p.getPrecio());

                m.setImage(p.getImagenUrl());
                
                return m;
            }).collect(Collectors.toList());

            dto.setMenu(menu);
            listaDTOs.add(dto);

        }
        return listaDTOs;
    }
}
