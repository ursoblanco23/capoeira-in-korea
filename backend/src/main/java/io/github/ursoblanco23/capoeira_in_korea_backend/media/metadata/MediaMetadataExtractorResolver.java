package io.github.ursoblanco23.capoeira_in_korea_backend.media.metadata;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaKind;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MediaMetadataExtractorResolver {

    private final List<MediaMetadataExtractor> extractors;

    public MediaMetadataExtractor resolve(MediaKind mediaKind) {
        return extractors.stream()
                .filter(extractor -> extractor.supports(mediaKind))
                .findFirst()
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.MEDIA_UNSUPPORTED_TYPE,
                        "지원하지 않는 미디어 메타데이터 형식입니다."
                ));
    }
}
