package io.github.ursoblanco23.capoeira_in_korea_backend.media.validation;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MediaFileValidatorResolver {

    private final List<MediaFileValidator> validators;

    public MediaFileValidator resolve(MediaFileType mediaType) {
        return validators.stream()
                .filter(v -> v.supports(mediaType))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_UNSUPPORTED_TYPE));
    }

}
