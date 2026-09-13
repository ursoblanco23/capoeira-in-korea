package io.github.ursoblanco23.capoeira_in_korea_backend.user.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.repository.UserRefreshTokenRepository;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.facade.MediaManagementFacade;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaAttachmentService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaFileService;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.dto.UserMeDto;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Clock;
import java.time.Instant;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final MediaFileService mediaFileService;
    private final MediaAttachmentService mediaAttachmentService;
    private final Clock clock;
    private final UserRefreshTokenRepository userRefreshTokenRepository;
    private final MediaManagementFacade mediaManagementFacade;

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
        User me = getUserById(userId);

        MediaFile mediaFile = mediaManagementFacade.replaceSingleAttachment(
                me
                ,file
                ,MediaFileType.PROFILE_IMAGE
                ,MediaAttachmentType.USER
                ,me.getId()
                ,null
        );

        // 응답
        UserMeDto meDto = UserMeDto.from(me);
        meDto.setProfileImgUrl(mediaFile.getFilePath());
        return meDto;
    }

    @Override
    public void withdrawMyAccount(long userId) {
        User user = getUserById(userId);

        // soft delete 정책
        Instant now = clock.instant();
        user.withdraw(now);
        userRefreshTokenRepository.revokeAllActiveByUserId(userId, now);
    }

}
