package io.github.ursoblanco23.capoeira_in_korea_backend.media.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoFileUploadResult {
    private String fileName;
    private String originalName;
    private String filePath;
    private String thumbnailPath;     // 비디오 썸네일
    private String mimeType;
    private Integer width;
    private Integer height;
    private Long duration;            // 비디오 길이 (초)
    private Long fileSize;
    private LocalDateTime uploadedAt;
}
