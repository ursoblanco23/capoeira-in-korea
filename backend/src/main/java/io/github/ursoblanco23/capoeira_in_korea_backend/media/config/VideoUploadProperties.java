package io.github.ursoblanco23.capoeira_in_korea_backend.media.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "file.upload.video")
public class VideoUploadProperties {

    private String baseDir;

    private Long maxSize;

    private List<String> allowedTypes;

    private List<String> allowedExtensions;
}
