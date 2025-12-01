package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    //Contar la cantidad de usuarios que hay teniendo en cuenta sus roles
    @Query("SELECT u.rol, COUNT(u) FROM Usuario u GROUP BY u.rol")
    /*
        - Una lista de arreglos (List<Object[]>), donde cada arreglo contiene:
        - Object[0]: el nombre del rol (ej. "cliente", "admin", "vendedor").
        - Object[1]: la cantidad de usuarios con ese rol.
    */
    List<Object[]> countRol();

    // Encontrar por correo
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByDocumento(String documento);
    boolean existsByCorreo(String correo);
    boolean existsByDocumento(String documento);
    boolean existsByRol(String rol);

    List<Usuario> findByRol(String rol);
}