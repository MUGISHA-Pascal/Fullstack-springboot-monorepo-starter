package com.starter.backend.services;

import com.starter.backend.dtos.UpdateInventoryDto;
import com.starter.backend.exceptions.ApiRequestException;
import com.starter.backend.models.Inventory;
import com.starter.backend.models.Product;
import com.starter.backend.repository.InventoryRepository;
import com.starter.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public Inventory updateInventory(UUID productId, UpdateInventoryDto updateInventoryDto) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ApiRequestException("Product with id " + productId + " not found"));

        // Update product quantity directly
        existingProduct.setQuantity(updateInventoryDto.getQuantity());
        productRepository.save(existingProduct);

        // Create or update inventory record
        Inventory inventory = inventoryRepository.findByProduct(existingProduct)
                .orElseGet(() -> {
                    Inventory newInventory = new Inventory();
                    newInventory.setProduct(existingProduct);
                    return newInventory;
                });

        inventory.setQuantity(updateInventoryDto.getQuantity());
        inventory.setLocation(updateInventoryDto.getLocation());

        return inventoryRepository.save(inventory);
    }

    public Inventory getInventory(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiRequestException("Product with id " + productId + " not found"));

        return inventoryRepository.findByProduct(product)
                .orElseGet(() -> {
                    Inventory inventory = new Inventory();
                    inventory.setProduct(product);
                    inventory.setQuantity(product.getQuantity());
                    inventory.setLocation("Default Location");
                    return inventoryRepository.save(inventory);
                });
    }
}
