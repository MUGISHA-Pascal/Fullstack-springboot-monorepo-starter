package com.starter.backend.controllers;

import com.starter.backend.dtos.UpdateInventoryDto;
import com.starter.backend.models.Inventory;
import com.starter.backend.services.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/inventory")
public class InventoryController {
    @Autowired
    InventoryService inventoryService;
    @PutMapping("/update/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable("id") UUID id, @RequestBody UpdateInventoryDto updateInventoryDto) {
        return ResponseEntity.ok(inventoryService.updateInventory(id, updateInventoryDto));
    }
}
