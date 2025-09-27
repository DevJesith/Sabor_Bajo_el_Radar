package com.sbr.sabor_bajo_el_radar.service.facade;
import com.sbr.sabor_bajo_el_radar.model.Pqr;
import com.sbr.sabor_bajo_el_radar.repository.PqrRepository;
import com.sbr.sabor_bajo_el_radar.service.local.PqrFacadeLocal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PqrFacade implements PqrFacadeLocal {

    private final PqrRepository pqrRepository;

    public PqrFacade(PqrRepository pqrRepository) {
        this.pqrRepository = pqrRepository;
    }

    @Override
    public Pqr save(Pqr pqr) {
        return pqrRepository.save(pqr);
    }

    @Override
    public Optional<Pqr> findById(Integer id) {
        return pqrRepository.findById(id);
    }

    @Override
    public List<Pqr> findAll() {
        return pqrRepository.findAll();
    }

    @Override
    public void deleteById(Integer id) {
        pqrRepository.deleteById(id);
    }
}
