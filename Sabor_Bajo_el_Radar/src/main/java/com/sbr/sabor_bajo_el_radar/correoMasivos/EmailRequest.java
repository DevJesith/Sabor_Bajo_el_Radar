package com.sbr.sabor_bajo_el_radar.correoMasivos;

import java.util.List;
import java.util.Map;

public class EmailRequest {
    private List<String> destinatarios;
    private String templateId;
    private Map<String,Object> datosDinamicos;

    public List<String> getDestinatarios() {
        return destinatarios;
    }

    public void setDestinatarios(List<String> destinatarios) {
        this.destinatarios = destinatarios;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public Map<String, Object> getDatosDinamicos() {
        return datosDinamicos;
    }

    public void setDatosDinamicos(Map<String, Object> datosDinamicos) {
        this.datosDinamicos = datosDinamicos;
    }
}
