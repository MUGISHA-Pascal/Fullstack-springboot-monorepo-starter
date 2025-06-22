package com.starter.backend.services;

import com.starter.backend.dtos.ProductDto;
import com.starter.backend.exceptions.ApiRequestException;
import com.starter.backend.models.Product;
import com.starter.backend.models.User;
import com.starter.backend.repository.ProductRepository;
import com.starter.backend.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final UserService userService;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(UUID id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setQuantity(productDetails.getQuantity());
        product.setCategory(productDetails.getCategory());
        
        if (productDetails.getInventory() != null) {
            product.getInventory().setQuantity(productDetails.getInventory().getQuantity());
            product.getInventory().setLocation(productDetails.getInventory().getLocation());
        }
        
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public List<Product> findProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategory(category);
        return products;
    }

    public Page<Product> productsPagination(int page, int size, String column) {
        Constants.validatePageNumberAndPageSize(page, size);
        Pageable pageable = (Pageable) PageRequest.of(page, size, Sort.Direction.ASC, column);
        Page<Product> products = productRepository.findAll(pageable);
        return products;
    }
}
