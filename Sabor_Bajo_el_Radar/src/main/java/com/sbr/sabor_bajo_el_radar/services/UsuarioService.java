//package com.sbr.sabor_bajo_el_radar.services;
//
//import com.sbr.sabor_bajo_el_radar.model.Role;
//import com.sbr.sabor_bajo_el_radar.model.Usuario;
//import com.sbr.sabor_bajo_el_radar.repository.RoleRepository;
//import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UsuarioService implements UserDetailsService {
//
//    private final UsuarioRepository usuarioRepository;
//    private final RoleRepository roleRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public UsuarioService(UsuarioRepository usuarioRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
//        this.usuarioRepository = usuarioRepository;
//        this.roleRepository = roleRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
//        return usuarioRepository.findByCorreo(correo)
//                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));
//    }
//
//    //Metodo para registrar usuarios
//    public Usuario registrar(Usuario usuario) {
//        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
//
//        if (usuario.getRol() == null || usuario.getRol().getId() == null) {
//            throw new IllegalArgumentException("El usuario debe tener ROL");
//        }
//
//        // Obtener el rol completo desde la BD
//        Role rol = roleRepository.findById(usuario.getRol().getId())
//                .orElseThrow(() -> new IllegalArgumentException("ROL no existe"));
//        usuario.setRol(rol);
//
//        return usuarioRepository.save(usuario);
//    }
//}
