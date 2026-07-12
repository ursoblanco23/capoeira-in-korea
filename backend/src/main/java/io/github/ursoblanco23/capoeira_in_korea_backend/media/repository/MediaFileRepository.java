package io.github.ursoblanco23.capoeira_in_korea_backend.media.repository;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
//    List<MediaFile> findByFileTypeAndDeletedAtIsNull(String fileType);
}
