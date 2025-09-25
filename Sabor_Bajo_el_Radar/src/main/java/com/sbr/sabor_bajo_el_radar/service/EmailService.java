package com.sbr.sabor_bajo_el_radar.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String apiKey;

    public  void enviarCorreo(String destinatario, String templateId, Map<String, Object> datosDinamicos) throws IOException{
        Email from = new Email("jesithmanuel@gmail.com");
        Email to = new Email(destinatario);

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId(templateId);

        Personalization personalization = new Personalization();
        personalization.addTo(to);



        for (Map.Entry<String, Object> entry : datosDinamicos.entrySet()) {
            personalization.addDynamicTemplateData(entry.getKey(), entry.getValue());
        }

        mail.addPersonalization(personalization);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            System.out.println("Status: " + response.getStatusCode());
            System.out.println("Body: " + response.getBody());
        } catch (IOException ex) {
            throw ex;
        }
    }

    public void  enviarCorreosMasivos(List<String> destinatarios, String templateId, Map<String, Object> datosGenerales) throws IOException{
        for (String email : destinatarios){
            Map<String, Object> datosPorUsuario = Map.copyOf(datosGenerales);
            enviarCorreo(email, templateId, datosPorUsuario);
        }
    }

    public void enviarCorreoLibre(String destinatario, String asunto, String contenido) throws IOException{
        Email from = new Email("jesithmanuel@gmail.com");
        Email to = new Email(destinatario);
        Content content = new Content("text/plain", contenido);

        Mail mail = new Mail(from, asunto, to, content);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);
        System.out.println("Status: " + response.getStatusCode());
    }
}
