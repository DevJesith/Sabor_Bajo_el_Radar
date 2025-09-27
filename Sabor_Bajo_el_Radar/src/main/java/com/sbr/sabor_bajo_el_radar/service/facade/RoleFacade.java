package com.sbr.sabor_bajo_el_radar.service.facade;
import com.sbr.sabor_bajo_el_radar.model.Role;
import com.sbr.sabor_bajo_el_radar.repository.RoleRepository;
import com.sbr.sabor_bajo_el_radar.service.local.RoleFacadeLocal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleFacade implements RoleFacadeLocal {

    private final RoleRepository roleRepository;

    public RoleFacade(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Role save(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Optional<Role> findById(Integer id) {
        return roleRepository.findById(id);
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public void deleteById(Integer id) {
        roleRepository.deleteById(id);
    }

    @Override
    public Optional<Role> findByNombre(String nombre) {
        return roleRepository.findByNombre(nombre);
    }
}
