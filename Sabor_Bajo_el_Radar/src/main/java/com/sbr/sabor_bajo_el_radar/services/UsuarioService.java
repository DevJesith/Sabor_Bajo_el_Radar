package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.PerfilUpdateDTO;
import com.sbr.sabor_bajo_el_radar.dtos.RegistroDTO;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
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

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));

        String roleName = "ROLE_" + usuario.getRol().toUpperCase();

        return org.springframework.security.core.userdetails.User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getContrasena())
                .authorities(roleName)
                .build();
    }

    // Opcional: registro directo con entidad Usuario
    @Transactional
    public Usuario registrar(Usuario usuario) {
        // Validaciones básicas
        if (usuario.getCorreo() == null || usuario.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (usuario.getContrasena() == null || usuario.getContrasena().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            throw new IllegalArgumentException("El usuario debe tener un rol asignado");
        }

        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("El correo ya existe");
        }
        if (usuario.getDocumento() != null && usuarioRepository.existsByDocumento(usuario.getDocumento())) {
            throw new IllegalArgumentException("El Documento ya existe");
        }

        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuario.setFechaRegistro(usuario.getFechaRegistro() != null ? usuario.getFechaRegistro() : LocalDate.now());

        return usuarioRepository.save(usuario);
    }

    // Registro vía DTO: recomendado
    @Transactional
    public Usuario registrar(RegistroDTO registroDTO) {
        // Validar contraseñas
        if (!registroDTO.getContrasena().equals(registroDTO.getConfirmarContrasena())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        // Unicidad de correo y documento
        if (usuarioRepository.existsByCorreo(registroDTO.getCorreo())) {
            throw new IllegalArgumentException("El correo ya existe");
        }
        if (usuarioRepository.existsByDocumento(registroDTO.getDocumento())) {
            throw new IllegalArgumentException("El Documento ya existe");
        }

        // Validar rol permitido
        String rolUpper = registroDTO.getRol() != null ? registroDTO.getRol().toUpperCase() : "";
        if (!rolUpper.equals("CLIENTE") && !rolUpper.equals("VENDEDOR")
                && !rolUpper.equals("DOMICILIARIO") && !rolUpper.equals("ADMINISTRADOR")) {
            throw new IllegalArgumentException("Rol no permitido");
        }

        // Construir y guardar Usuario
        Usuario usuario = new Usuario();
        usuario.setNombres(registroDTO.getNombres());
        usuario.setApellidos(registroDTO.getApellidos());
        usuario.setDocumento(registroDTO.getDocumento());
        usuario.setTelefono(registroDTO.getTelefono());
        usuario.setCorreo(registroDTO.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(registroDTO.getContrasena()));
        usuario.setRol(rolUpper);
        usuario.setFechaRegistro(LocalDate.now());

        return usuarioRepository.save(usuario);
    }

    public Usuario findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));
    }

    @Transactional
    public void eliminarCuentaDefinitivamente(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("No se pudo encontrar el usuario para eliminar"));

        usuarioRepository.delete(usuario);
    }

    public Usuario actualizarPerfil(String correo, @Valid PerfilUpdateDTO updateDTO) {

        Usuario usuario = findByCorreo(correo);
        usuario.setNombres(updateDTO.getNombres());
        usuario.setApellidos(updateDTO.getApellidos());
        usuario.setDocumento(updateDTO.getDocumento());
        usuario.setTelefono(updateDTO.getTelefono());

        boolean quiereCambiarPass = updateDTO.getContrasenaActual() != null && !updateDTO.getContrasenaActual().isEmpty() && updateDTO.getNuevaContrasena() != null && !updateDTO.getNuevaContrasena().isEmpty();

        if (quiereCambiarPass) {

            if (!passwordEncoder.matches(updateDTO.getContrasenaActual(), usuario.getContrasena())) {
                throw new IllegalArgumentException("La contraseña actual es incorrecta");
            }

            if (passwordEncoder.matches(updateDTO.getContrasenaActual(), usuario.getContrasena())) {
                throw new IllegalArgumentException("La nueva contraseña no puede ser igual a la actual");
            }

            usuario.setContrasena(passwordEncoder.encode(updateDTO.getNuevaContrasena()));

        }

        return usuarioRepository.save(usuario);
        
    }
}
