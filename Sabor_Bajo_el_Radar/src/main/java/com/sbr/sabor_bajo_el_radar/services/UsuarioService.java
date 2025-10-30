package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.RegistroDTO;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // encontrar usuarios por correo
    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        return usuarioRepository.findByCorreo(correo).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));
    }

    //Metodo para registrar usuarios
    public Usuario registrar(Usuario usuario) {
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        // validacion de rol
        if (usuario.getRol() == null || usuario.getRol().trim().isEmpty()) {
            throw new IllegalArgumentException("El usuario debe tener un rol asignado");
        }

        // validar si existe rol
        if (!usuarioRepository.existsByRol(usuario.getRol())){
            throw new IllegalArgumentException("El Rol no existe");
        }

        return usuarioRepository.save(usuario);
    }

    // metoo registro
    @Transactional
    public Usuario registrar(RegistroDTO registroDTO){
        // validar contraseñas
        if (!registroDTO.getContrasena().equals(registroDTO.getConfirmarContrasena())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        //validar que el correo exista
        if (usuarioRepository.existsByCorreo(registroDTO.getCorreo())) {
            throw new IllegalArgumentException("El correo ya existe");
        }

        // validad si el documento existe
        if (usuarioRepository.existsByDocumento(registroDTO.getDocumento())) {
            throw new IllegalArgumentException("El Documento ya existe");
        }

        // validar que solo se puedan registrar ciertos roles
        String rolUpper = registroDTO.getRol().toUpperCase();
        if (!rolUpper.equals("CLIENTE") && !rolUpper.equals("VENDEDOR") && !rolUpper.equals("DOMICILIARIO")){
            throw new IllegalArgumentException("Rol no permitido");
        }

        // Crear nuevos usuarios
        Usuario usuario = new Usuario();
        usuario.setNombres(registroDTO.getNombres());
        usuario.setApellidos(registroDTO.getApellidos());
        usuario.setDocumento(registroDTO.getDocumento());
        usuario.setTelefono(registroDTO.getTelefono());
        usuario.setCorreo(registroDTO.getCorreo());
        usuario.setContrasena(registroDTO.getContrasena());
        //Encriptar contraseña
        usuario.setContrasena(passwordEncoder.encode(registroDTO.getContrasena()));
        usuario.setRol(rolUpper);
        usuario.setFechaRegistro(LocalDate.now());

        return usuarioRepository.save(usuario);
    }
}
