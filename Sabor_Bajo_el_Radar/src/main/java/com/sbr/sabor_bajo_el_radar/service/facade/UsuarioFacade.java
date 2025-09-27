package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.UsuarioFacadeLocal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioFacade implements UsuarioFacadeLocal {

    private final UsuarioRepository usuarioRepository;

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
}
