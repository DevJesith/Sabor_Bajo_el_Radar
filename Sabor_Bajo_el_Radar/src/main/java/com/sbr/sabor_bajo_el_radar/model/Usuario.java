package com.sbr.sabor_bajo_el_radar.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "usuarios")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "nombres", nullable = false, length = 50)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 50)
    private String apellidos;

    @Column(name = "documento", nullable = false, length = 15)
    private String documento;

    @Column(name = "telefono", nullable = false, length = 11)
    private String telefono;

    @Column(name = "correo", nullable = false, length = 100)
    private String correo;

    @Column(name = "`contrasena`", nullable = false)
    private String contrasena;

    @Lob
    @Column(name = "rol", nullable = false)
    private String rol;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    // ----------------------------------------------------------------------
    // IMPLEMENTACIÓN DE LOS MÉTODOS DE LA INTERFAZ UserDetails
    // ----------------------------------------------------------------------

    /**
     * Retorna los roles/autoridades del usuario.
     * Asume que tienes un campo 'rol' en tu clase.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convierte el String 'rol' a una colección de GrantedAuthority
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + rol));
    }

    /**
     * Retorna la contraseña utilizada para la autenticación.
     */
    @Override
    public String getPassword() {
        return contrasena;
    }

    /**
     * Retorna el nombre de usuario (la identidad única).
     * Usamos el campo 'correo' para este propósito.
     */
    @Override
    public String getUsername() {
        return correo;
    }

    /**
     * Indica si la cuenta del usuario no ha expirado.
     * Normalmente retorna 'true'.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indica si la cuenta del usuario no está bloqueada.
     * Normalmente retorna 'true'.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indica si las credenciales del usuario (contraseña) no han expirado.
     * Normalmente retorna 'true'.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indica si el usuario está habilitado o deshabilitado.
     * Normalmente retorna 'true'.
     */
    @Override
    public boolean isEnabled() {
        return true;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

}