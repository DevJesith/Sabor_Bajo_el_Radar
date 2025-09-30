package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Role;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Long countByRol(Role rol);
    // Puedes agregar métodos personalizados de consulta si lo necesitas

    Optional<Usuario> findByCorreo(String correo);

}
