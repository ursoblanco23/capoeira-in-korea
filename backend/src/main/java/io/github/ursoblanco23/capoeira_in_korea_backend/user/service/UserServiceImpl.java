package io.github.ursoblanco23.capoeira_in_korea_backend.user.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaAttachment;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaAttachmentService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaFileService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.validation.MediaFileValidator;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.validation.MediaFileValidatorResolver;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.dto.UserMeDto;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final MediaFileService mediaFileService;
    private final MediaAttachmentService mediaAttachmentService;

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found with id: " + id));
    }

    @Override
    public UserMeDto getMe(Long principalId) {
        User authUser = userRepository.findUserWithRolesById(principalId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found with id: " + principalId));

        UserMeDto meDto = UserMeDto.from(authUser);

        mediaAttachmentService.findAttachment(MediaAttachmentType.USER, principalId, MediaFileType.PROFILE_IMAGE).ifPresent(attachment -> meDto.setProfileImgUrl(attachment.getMedia().getFilePath()));
        return meDto;
    }

    @Override
    public UserMeDto updateMyProfileImage(long userId, MultipartFile file) {
        // user
        User me = getUserById(userId);

        // media_file
        MediaFile mediaFile = mediaFileService.storeFile(me, file, MediaFileType.PROFILE_IMAGE);

        // media_attachment
        MediaFile oldMedia = mediaAttachmentService.replaceSingleAttachment(mediaFile, MediaFileType.PROFILE_IMAGE, userId, MediaAttachmentType.USER);

        if (oldMedia != null) mediaFileService.deleteFile(oldMedia);

        //응답
        UserMeDto meDto = UserMeDto.from(me);
        meDto.setProfileImgUrl(mediaFile.getFilePath());
        return meDto;
    }

}
