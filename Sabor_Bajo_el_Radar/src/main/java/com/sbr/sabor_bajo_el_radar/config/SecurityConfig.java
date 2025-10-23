//package com.sbr.sabor_bajo_el_radar.config;
//
//import com.sbr.sabor_bajo_el_radar.services.UsuarioService;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    private final UsuarioService usuarioService;
//    private final CustomLoginSuccessHandler successHandler;
//    private final PasswordEncoder passwordEncoder;
//
//    public SecurityConfig(UsuarioService usuarioService, CustomLoginSuccessHandler successHandler,  PasswordEncoder passwordEncoder) {
//        this.usuarioService = usuarioService;
//        this.successHandler = successHandler;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//
//    @Bean
//    public DaoAuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(usuarioService);
//        authProvider.setPasswordEncoder(passwordEncoder); // clase creada para que compare el hash con el trexto plano
//        return authProvider;
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .authorizeHttpRequests(auth -> auth
//                        //publico
//                        .requestMatchers("/","/registro", "/login", "/css/**", "/js/**", "/img/**", "/img/Quienes_Somos/**","/img/testimonio/**", "/mapa-navegacion", "/terminos-y-condiciones", "/como-funciona","/mantenimiento", "/quienes-somos", "/muro-social").permitAll()
//
//                        // solo el admin puede ver el Dashboard
//                        .requestMatchers("/Administrador/panel_administrador/panel_administrador").hasRole("ADMINISTRADOR")
//
//                        // las demas necesitan login
//                        .anyRequest().authenticated()
//                )
//                .formLogin(form -> form
//                        .loginPage("/login")
//                        .permitAll()
//                        .successHandler(((request, response, authentication) -> {
//                            // segun el rol se manda a su pagina
//                            var roles = authentication.getAuthorities().toString();
//                            if (roles.contains("ROLE_ADMINISTRADOR")) {
//                                response.sendRedirect("/dashboard/admin");
//                            } else {
//                                response.sendRedirect("/mantenimiento");
//                            }
//                        }))
//                )
//                .logout(logout -> logout
//                        .logoutSuccessUrl("/login?logout")
//                        .permitAll()
//                );
//
//        return http.build();
//    }
//}
