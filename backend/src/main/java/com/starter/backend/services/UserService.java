package com.starter.backend.services;

import com.starter.backend.dtos.UserUpdateDto;
import com.starter.backend.exceptions.ApiRequestException;
import com.starter.backend.exceptions.AppException;
import com.starter.backend.exceptions.ResourceNotFoundException;
import com.starter.backend.models.Role;
import com.starter.backend.models.User;
import com.starter.backend.repository.RoleRepository;
import com.starter.backend.repository.UserRepository;
import com.starter.backend.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    @Autowired
    public UserService(UserRepository userRepository,RoleRepository roleRepository){
        this.userRepository=userRepository;
        this.roleRepository=roleRepository;
    }
    public User getUser(UUID userId){
        return this.userRepository.findById(userId).orElseThrow(()-> new ApiRequestException("user with id "+userId+" not found"));
    }
    public User deleteUser(UUID userId){
        User user = userRepository.findById(userId).orElseThrow(()-> new ApiRequestException("user with id "+userId+" not found"));
   this.userRepository.delete(user);

   return user;
    }
    public Page<User> getAllUsers(int page,int size,String column){
        Constants.validatePageNumberAndPageSize(page,size);
        Pageable pageable = (Pageable) PageRequest.of(page,size, Sort.Direction.ASC,column);
        Page<User> users = userRepository.findAll(pageable);
        System.out.println("users"+users);
        return users;
    }
    public UUID getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
            String email = userDetails.getUsername();
            System.out.println("email "+email);
            User user= userRepository.findByEmail(email).orElseThrow(() -> new ApiRequestException("User with email " + email + " not found"));
            return user.getId();
        }

        throw new ApiRequestException("No authenticated user found");
    }
    public User updateUser(UUID userId, UserUpdateDto userUpdateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

//        if (!Objects.equals(getLoggedInUserId(), user.getId())) {
//            throw new AppException("You are not authorized to update this user");
//        }

        if (userRepository.existsByMobile(userUpdateRequest.getMobile())
                && !userUpdateRequest.getMobile().equalsIgnoreCase(user.getMobile())) {
            throw new AppException("Phone number already in use");
        } else {
            user.setMobile(userUpdateRequest.getMobile());
        }

        user.setFirstName(userUpdateRequest.getFirstName());
        user.setLastName(userUpdateRequest.getLastName());
        user.setGender(userUpdateRequest.getGender());
        user.setEmail(userUpdateRequest.getEmail());
        user.setStatus(userUpdateRequest.getStatus());

        if (userUpdateRequest.getRole() == null || userUpdateRequest.getRole().length == 0) {
            throw new AppException("At least one role must be specified");
        }

        Role role = roleRepository.findByName(userUpdateRequest.getRole()[0])
                .orElseThrow(() -> new ApiRequestException("Role " + userUpdateRequest.getRole()[0] + " not found"));

        user.setRoles(new HashSet<>(Set.of(role)));

        return userRepository.save(user);
    }
}
