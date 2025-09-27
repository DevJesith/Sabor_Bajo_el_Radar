package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.MedioDeTransporte;
import com.sbr.sabor_bajo_el_radar.repository.MedioDeTransporteRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.MedioDeTransporteFacadeLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedioDeTransporteFacade implements MedioDeTransporteFacadeLocal {

    @Autowired
    private MedioDeTransporteRepository medioDeTransporteRepository;

    @Override
    public MedioDeTransporte create(MedioDeTransporte medioDeTransporte) {
        return medioDeTransporteRepository.save(medioDeTransporte);
    }

    @Override
    public MedioDeTransporte update(MedioDeTransporte medioDeTransporte) {
        return medioDeTransporteRepository.save(medioDeTransporte);
    }

    @Override
    public void delete(Integer id) {
        medioDeTransporteRepository.deleteById(id);
    }

    @Override
    public Optional<MedioDeTransporte> find(Integer id) {
        return medioDeTransporteRepository.findById(id);
    }

    @Override
    public List<MedioDeTransporte> findAll() {
        return medioDeTransporteRepository.findAll();
    }
}
