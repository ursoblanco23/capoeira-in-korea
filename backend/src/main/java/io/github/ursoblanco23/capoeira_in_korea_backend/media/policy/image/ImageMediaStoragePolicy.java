package io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.image;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.config.ImageUploadProperties;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.MediaStoragePolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

import static io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType.*;

@Component
@RequiredArgsConstructor
public class ImageMediaStoragePolicy implements MediaStoragePolicy {

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

    /**
     * @return image 파일들의 root 디렉토리
     */
    @Override
    public String getBaseDir() {
        return imageUploadProperties.getBaseDir();
    }

    /**
     * @param mediaFileType 어떤 목적의 이미지 파일인지를 나타내는 type
     * @return path = image base Dir + mediaType Dir
     */
    @Override
    public String getDirectoryBy(MediaFileType mediaFileType) {
        return imageUploadProperties.getDirectoryBy(mediaFileType);
    }
}
