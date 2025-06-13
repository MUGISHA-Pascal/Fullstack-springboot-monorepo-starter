package com.starter.backend.dtos;

import com.starter.backend.enums.EGender;
import com.starter.backend.enums.ERoleType;
import com.starter.backend.enums.EStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDto {
    @Size(max=100)
    @Email
    private String email;
    @NotBlank
    @Size(min=4,max=20)
    private String firstName;
    @NotBlank
    @Size(min=4,max = 40)
    private String lastName;
    @NotBlank
    @Size(min = 4,max=40)
    @Pattern(regexp = "[0-9]{10}")
    private String mobile;
    private EGender gender;
    private EStatus status = EStatus.ACTIVE;
    private ERoleType[] role;
}
