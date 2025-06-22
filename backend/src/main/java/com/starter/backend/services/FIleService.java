package com.starter.backend.services;

import com.starter.backend.models.File;
import com.starter.backend.models.User;
import com.starter.backend.repository.FileRepository;
import com.starter.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class FIleService {
    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserService userService;

    public File storeFile(MultipartFile file) throws IOException {
        File newFile = new File();
        newFile.setName(file.getOriginalFilename());
        newFile.setType(file.getContentType());
        newFile.setSize(file.getSize());
        newFile.setFile(file.getBytes());
        newFile.setPath("/uploads/" + file.getOriginalFilename());
        
        // Get the current user and set it on the file
        UUID userId = userService.getLoggedInUserId();
        User user = userService.getUser(userId);
        newFile.setUser(user);
        
        return fileRepository.save(newFile);
    }

    public File getFile(UUID id) {
        return fileRepository.findById(id).orElse(null);
    }

    public List<File> getAllFiles() {
        return fileRepository.findAll();
    }

    public void deleteFile(UUID id) {
        File file = getFile(id);
        if (file == null) {
            throw new RuntimeException("File not found");
        }
        fileRepository.delete(file);
    }
}
