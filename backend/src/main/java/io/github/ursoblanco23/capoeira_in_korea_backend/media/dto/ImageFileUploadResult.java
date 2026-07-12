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
public class ImageFileUploadResult {
    private String fileName;           // 저장된 파일명 (UUID_originalName.ext)
    private String originalName;       // 원본 파일명
    private String filePath;          // 실제 저장 경로 (/images/2024/01/uuid_file.jpg)
    private String thumbnailPath;     // 썸네일 경로 (/images/2024/01/thumb_uuid_file.jpg)
    private String mimeType;          // image/jpeg, image/png 등
    private Integer width;            // 원본 이미지 가로
    private Integer height;           // 원본 이미지 세로
    private Long size;            // 파일 크기 (bytes)
    private LocalDateTime uploadedAt; // 업로드 시간
}
