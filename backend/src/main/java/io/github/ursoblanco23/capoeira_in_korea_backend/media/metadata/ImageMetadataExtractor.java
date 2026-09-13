package io.github.ursoblanco23.capoeira_in_korea_backend.media.metadata;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.ImageMetadata;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaKind;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

@Component
public class ImageMetadataExtractor implements MediaMetadataExtractor {

    @Override
    public boolean supports(MediaKind mediaKind) {
        return mediaKind == MediaKind.IMAGE;
    }
    @Override
    public ImageMetadata extract(MultipartFile file) {
        try {
            BufferedImage image = ImageIO.read(file.getInputStream());

            if (image == null) {
                throw new BusinessException(ErrorCode.MEDIA_METADATA_EXTRACTION_FAILED,
                        "이미지 메타데이터를 읽을 수 없습니다.");
            }

            return ImageMetadata.builder()
                    .width(image.getWidth())
                    .height(image.getHeight())
                    .build();

        } catch (IOException e) {
            throw new BusinessException(ErrorCode.MEDIA_METADATA_EXTRACTION_FAILED, e);
        }
    }

}
