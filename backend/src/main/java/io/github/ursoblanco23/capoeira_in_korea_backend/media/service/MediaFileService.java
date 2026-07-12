package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

// 역할: 업로드 파일의 비즈니스 검증/변환
public interface MediaFileService {

    // uploadImgFile TODO 아래 메서드는 재정리 필요 - dojang 쪽 코드들과 연관되어있어서 지금 바로 수정 x
    MediaFile uploadImgFile(MultipartFile file, MediaFileType fileType, String altText, User uploader);

    void deleteFile(MediaFile file);

    // user profile 작업시 생성된 new uploadImgFile 메서드
    MediaFile storeFile(User me, MultipartFile file, MediaFileType mediaType);

}
