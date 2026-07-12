package io.github.ursoblanco23.capoeira_in_korea_backend.media.validation.validator;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.MediaValidationPolicy;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.util.FileNameUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class MediaFileValidationSupport {

    public void validateNotEmpty(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.MEDIA_EMPTY_FILE);
        }
    }

    public void validateSize(MultipartFile file, MediaValidationPolicy policy) {
        if (file.getSize() > policy.getMaxSize()) {
            throw new BusinessException(
                    ErrorCode.MEDIA_FILE_SIZE_EXCEEDED,
                    String.format("파일 크기가 %dMB를 초과했습니다.", policy.getMaxSize() / 1024 / 1024)
            );
        }
    }

    public void validateExtension(MultipartFile file, MediaValidationPolicy policy) {
        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null ||
                !FileNameUtils.hasExtensionIn(originalFilename, policy.getAllowedExtensions())) {
            throw new BusinessException(ErrorCode.MEDIA_INVALID_EXTENSION);
        }
    }

    public void validateMimeType(MultipartFile file, MediaValidationPolicy policy) {
        String contentType = file.getContentType();

        if (contentType == null ||
                !policy.getAllowedTypes().contains(contentType.toLowerCase())) {
            throw new BusinessException(
                    ErrorCode.MEDIA_INVALID_MIME_TYPE,
                    "허용되지 않는 MIME 타입입니다. (허용: " + String.join(", ", policy.getAllowedTypes()) + ")"
            );
        }
    }
}
