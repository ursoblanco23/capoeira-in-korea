package io.github.ursoblanco23.capoeira_in_korea_backend.user.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.user.dto.UserMeDto;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    User getUserById(Long id);
    UserMeDto getMe(Long id);
    UserMeDto updateMyProfileImage(long userId, MultipartFile file);
}

