package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.FileUploadResult;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import org.springframework.web.multipart.MultipartFile;

// 역할: 파일 저장 로직 담당
public interface StorageService {
    FileUploadResult uploadFile(MultipartFile file, MediaFileType mediaFileType);

    void deleteFile(String filePath);
}
