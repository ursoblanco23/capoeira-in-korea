package io.github.ursoblanco23.capoeira_in_korea_backend.media.metadata;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.MediaMetadata;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaKind;
import org.springframework.web.multipart.MultipartFile;

public interface MediaMetadataExtractor {

    boolean supports(MediaKind mediaKind);

    MediaMetadata extract(MultipartFile file);
}
