package io.github.ursoblanco23.capoeira_in_korea_backend.media.repository;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaAttachment;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaAttachmentRepository extends JpaRepository<MediaAttachment, Long> {

    Optional<MediaAttachment> findByAttachableTypeAndAttachableIdAndMediaType (
            MediaAttachmentType attachableType,
            Long attachableId,
            MediaFileType mediaType
    );

}