package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Role;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.RoleRepository;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.UsuarioFacadeLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UsuarioFacade implements UsuarioFacadeLocal {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    public UsuarioFacade(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuario create(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario edit(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public void remove(Integer id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Optional<Usuario> find(Integer id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public long count() {
        return usuarioRepository.count();
    }

    @Override
    public Map<String, Long> contarUsuariosPorRol() {
        Map<String, Long> data = new HashMap<>();

        Role admin = roleRepository.findByNombre("Admin");
        Role cliente = roleRepository.findByNombre("Cliente");
        Role vendedor = roleRepository.findByNombre("Vendedor");
        Role domiciliario = roleRepository.findByNombre("Domiciliario");

        data.put("Admin", usuarioRepository.countByRol(admin));
        data.put("Cliente", usuarioRepository.countByRol(cliente));
        data.put("Vendedor", usuarioRepository.countByRol(vendedor));
        data.put("Domiciliario", usuarioRepository.countByRol(domiciliario));
        return data;

    }
}
