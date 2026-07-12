package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.ImageFileUploadResult;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import org.springframework.web.multipart.MultipartFile;

// 역할: 파일 저장 로직 담당
public interface StorageService {
    ImageFileUploadResult uploadFile(MultipartFile file, MediaFileType imageType);

    void deleteFile(String filePath);
}
