package com.sbr.sabor_bajo_el_radar.dtos;

import java.math.BigDecimal;
import java.util.List;

public class ClienteHomeDTO {
    // Clase principal para el Negocio
    public static class VendorDTO {
        private Long id;
        private String name;
        private String category;
        private String image;
        private String location;
        private String discount; // Opcional, lógica de negocio
        private Double rating;   // Quemado o calculado
        private List<MenuDTO> menu;

        // Constructores, Getters y Setters
        public VendorDTO() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getDiscount() {
            return discount;
        }

        public void setDiscount(String discount) {
            this.discount = discount;
        }

        public Double getRating() {
            return rating;
        }

        public void setRating(Double rating) {
            this.rating = rating;
        }

        public List<MenuDTO> getMenu() {
            return menu;
        }

        public void setMenu(List<MenuDTO> menu) {
            this.menu = menu;
        }
    }

    // Clase interna para los Productos (Menú)
    public static class MenuDTO {
        private Long id;
        private String name;
        private BigDecimal price;
        private String description;
        private String image;

        // Constructores, Getters y Setters
        public MenuDTO() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }
    }
}