package io.github.ursoblanco23.capoeira_in_korea_backend.media.config;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

import static io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType.*;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "file.upload.image")
public class ImageUploadProperties {

    private String baseDir;

    private String generalDir;

    private String thumbnailDir;

    private String profileDir;

    private Long maxSize;

    private Integer thumbnailSize;

    private List<String> allowedTypes;

    private List<String> allowedExtensions;

    public String getDirectoryBy(MediaFileType mediaFileType) {
        return switch (mediaFileType) {
            case PROFILE_IMAGE -> profileDir;
            case THUMBNAIL -> thumbnailDir;
            case GENERAL -> generalDir;
        };
    }

}
