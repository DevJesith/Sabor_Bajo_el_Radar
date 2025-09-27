package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.MuroSocial;
import com.sbr.sabor_bajo_el_radar.repository.MuroSocialRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.MuroSocialFacadeLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MuroSocialFacade implements MuroSocialFacadeLocal {

    @Autowired
    private MuroSocialRepository muroSocialRepository;

    @Override
    public MuroSocial create(MuroSocial muroSocial) {
        return muroSocialRepository.save(muroSocial);
    }

    @Override
    public MuroSocial update(MuroSocial muroSocial) {
        return muroSocialRepository.save(muroSocial);
    }

    @Override
    public void delete(Integer id) {
        muroSocialRepository.deleteById(id);
    }

    @Override
    public Optional<MuroSocial> find(Integer id) {
        return muroSocialRepository.findById(id);
    }

    @Override
    public List<MuroSocial> findAll() {
        return muroSocialRepository.findAll();
    }
}
