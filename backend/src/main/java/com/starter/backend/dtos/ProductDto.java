package com.starter.backend.dtos;

import lombok.Data;

@Data
public class ProductDto {
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private String category;
    private InventoryDto inventory;

    @Data
    public static class InventoryDto {
        private Integer quantity;
        private String location;
    }
}
