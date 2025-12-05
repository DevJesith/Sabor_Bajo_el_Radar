package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.RegistroDTO;
import com.sbr.sabor_bajo_el_radar.model.*;
import com.sbr.sabor_bajo_el_radar.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;

@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminRepository adminRepository; // <-- INYECTAR
    private final VendedorRepository vendedorRepository;
    private final ClienteRepository clienteRepository;
    private final DomiciliarioRepository domiciliarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, AdminRepository adminRepository, VendedorRepository vendedorRepository, ClienteRepository clienteRepository, DomiciliarioRepository domiciliarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminRepository = adminRepository;
        this.vendedorRepository = vendedorRepository;
        this.clienteRepository = clienteRepository;
        this.domiciliarioRepository = domiciliarioRepository;
    }

    // encontrar usuarios por correo
    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));

        // Se agrega el prefijo ROLE
        String roleName = "ROLE_" + usuario.getRol().toUpperCase();

        return org.springframework.security.core.userdetails.User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getContrasena())
                .authorities(roleName)
                .build();
    }


    //Metodo para registrar usuarios
    public Usuario registrar(Usuario usuario) {
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        // validacion de rol
        if (usuario.getRol() == null || usuario.getRol().trim().isEmpty()) {
            throw new IllegalArgumentException("El usuario debe tener un rol asignado");
        }

        // validar si existe rol
        if (!usuarioRepository.existsByRol(usuario.getRol())) {
            throw new IllegalArgumentException("El Rol no existe");
        }

        return usuarioRepository.save(usuario);
    }

    // metoo registro
//    @Transactional
//    public Usuario registrar(RegistroDTO registroDTO) {
//        // validar contraseñas
//        if (!registroDTO.getContrasena().equals(registroDTO.getConfirmarContrasena())) {
//            throw new IllegalArgumentException("Las contraseñas no coinciden");
//        }
//
//        //validar que el correo exista
//        if (usuarioRepository.existsByCorreo(registroDTO.getCorreo())) {
//            throw new IllegalArgumentException("El correo ya existe");
//        }
//
//        // validad si el documento existe
//        if (usuarioRepository.existsByDocumento(registroDTO.getDocumento())) {
//            throw new IllegalArgumentException("El Documento ya existe");
//        }
//
//        // validar que solo se puedan registrar ciertos roles
//        String rolUpper = registroDTO.getRol().toUpperCase();
//        if (!rolUpper.equals("CLIENTE") && !rolUpper.equals("VENDEDOR") && !rolUpper.equals("DOMICILIARIO") && !rolUpper.equals("ADMINISTRADOR")) {
//            throw new IllegalArgumentException("Rol no permitido");
//        }
//
//        // Crear nuevos usuarios
//        Usuario usuario = new Usuario();
//        usuario.setNombres(registroDTO.getNombres());
//        usuario.setApellidos(registroDTO.getApellidos());
//        usuario.setDocumento(registroDTO.getDocumento());
//        usuario.setTelefono(registroDTO.getTelefono());
//        usuario.setCorreo(registroDTO.getCorreo());
//        usuario.setContrasena(registroDTO.getContrasena());
//        //Encriptar contraseña
//        usuario.setContrasena(passwordEncoder.encode(registroDTO.getContrasena()));
//        usuario.setRol(rolUpper);
//        usuario.setFechaRegistro(LocalDate.now());
//
//        return usuarioRepository.save(usuario);
//    }

    // --- MÉTODO DE REGISTRO ACTUALIZADO Y COMPLETO ---
    @Transactional
    public Usuario registrar(RegistroDTO registroDTO) {
        // 1. Validaciones previas
        if (!registroDTO.getContrasena().equals(registroDTO.getConfirmarContrasena())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }
        if (usuarioRepository.existsByCorreo(registroDTO.getCorreo())) {
            throw new IllegalArgumentException("El correo ya existe");
        }
        if (usuarioRepository.existsByDocumento(registroDTO.getDocumento())) {
            throw new IllegalArgumentException("El Documento ya existe");
        }

        String rolUpper = registroDTO.getRol().toUpperCase();
        if (!rolUpper.equals("CLIENTE") && !rolUpper.equals("VENDEDOR") && !rolUpper.equals("DOMICILIARIO") && !rolUpper.equals("ADMINISTRADOR")) {
            throw new IllegalArgumentException("Rol no permitido");
        }

        // 2. Crear y guardar la entidad Usuario
        Usuario usuario = new Usuario();
        usuario.setNombres(registroDTO.getNombres());
        usuario.setApellidos(registroDTO.getApellidos());
        usuario.setDocumento(registroDTO.getDocumento());
        usuario.setTelefono(registroDTO.getTelefono());
        usuario.setCorreo(registroDTO.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(registroDTO.getContrasena()));
        usuario.setRol(rolUpper);
        usuario.setFechaRegistro(LocalDate.now());

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // 3. Crear la entidad de Rol correspondiente (Admin, Vendedor, etc.)
        switch (rolUpper) {
            case "ADMINISTRADOR":
                Admin admin = new Admin();
                admin.setUsuario(usuarioGuardado);

                admin.setFechaAsignacion(Instant.now());
                adminRepository.save(admin);
                break;
            case "VENDEDOR":
                Vendedor vendedor = new Vendedor();
                vendedor.setUsuario(usuarioGuardado);
                vendedorRepository.save(vendedor);
                break;
            case "CLIENTE":
                Cliente cliente = new Cliente();
                cliente.setUsuario(usuarioGuardado);
                clienteRepository.save(cliente);
                break;
            case "DOMICILIARIO":
                Domiciliario domiciliario = new Domiciliario();
                domiciliario.setUsuario(usuarioGuardado);
                domiciliarioRepository.save(domiciliario);
                break;
        }

        return usuarioGuardado;
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
}
