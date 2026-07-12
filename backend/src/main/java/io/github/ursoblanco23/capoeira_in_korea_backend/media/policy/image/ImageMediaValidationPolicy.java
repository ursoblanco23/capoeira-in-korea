package io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.image;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.config.ImageUploadProperties;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.MediaValidationPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

import static io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType.*;

@Component
@RequiredArgsConstructor
public class ImageMediaValidationPolicy implements MediaValidationPolicy {

    private static final Set<MediaFileType> SUPPORTED_TYPES = Set.of(
            GENERAL,
            THUMBNAIL,
            PROFILE_IMAGE
    );

    private final ImageUploadProperties imageUploadProperties;

    @Override
    public boolean supports(MediaFileType mediaFileType) {
        return SUPPORTED_TYPES.contains(mediaFileType);
    }

    @Override
    public long getMaxSize() {
        return imageUploadProperties.getMaxSize();
    }

    @Override
    public List<String> getAllowedTypes() {
        return imageUploadProperties.getAllowedTypes();
    }

    @Override
    public List<String> getAllowedExtensions() {
        return imageUploadProperties.getAllowedExtensions();
    }
}
