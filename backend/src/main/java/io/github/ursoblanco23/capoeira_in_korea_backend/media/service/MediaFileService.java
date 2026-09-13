package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

// 역할: 업로드 파일의 비즈니스 검증/변환
public interface MediaFileService {

    MediaFile storeFile(User me, MultipartFile file, MediaFileType mediaType, String altText);

    void deleteFileRecord(MediaFile file);

}
