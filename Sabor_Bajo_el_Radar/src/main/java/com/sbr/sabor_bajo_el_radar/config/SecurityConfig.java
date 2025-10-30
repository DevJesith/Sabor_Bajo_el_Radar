package com.sbr.sabor_bajo_el_radar.config;

import com.sbr.sabor_bajo_el_radar.services.UsuarioService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final PasswordEncoder passwordEncoder;
    private final UsuarioService usuarioService;

    public SecurityConfig(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(usuarioService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas
                        .requestMatchers(
                                "/",
                                "/registro/**",
                                "/login**",
                                "/css/**",
                                "/js/**",
                                "/img/**",
                                "/img/Quienes_Somos/**",
                                "/img/testimonio/**",
                                "/mapa-navegacion",
                                "/terminos-y-condiciones",
                                "/como-funciona",
                                "/mantenimiento",
                                "/quienes-somos",
                                "/muro-social"
                        ).permitAll()

                        // Solo el admin puede ver el Dashboard
                        .requestMatchers("/Administrador/**").hasRole("ADMINISTRADOR")

                        // Las demás necesitan autenticación
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/login")
                        .usernameParameter("correo")
                        .passwordParameter("contrasena")
                        .permitAll()
                        .successHandler((request, response, authentication) -> {
                            // Redirigir según el rol
                            if (authentication.getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"))) {
                                response.sendRedirect("/Administrador/panel_administrador/panel_administrador");
                            } else {
                                response.sendRedirect("/mantenimiento");
                            }
                        })
                        .failureUrl("/login?error=true")
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout=true")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                )
                .csrf(csrf -> csrf.disable()); // deshabilitado para hacer pruebas

        return http.build();
    }
}