package io.github.ursoblanco23.capoeira_in_korea_backend.media.repository;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaAttachment;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MediaAttachmentRepository extends JpaRepository<MediaAttachment, Long> {

    Optional<MediaAttachment> findByAttachableTypeAndAttachableIdAndMediaType (
            MediaAttachmentType attachableType,
            long attachableId,
            MediaFileType mediaType
    );

    @EntityGraph(attributePaths = "media")
    Optional<MediaAttachment>
    findByAttachableTypeAndAttachableIdAndMediaTypeAndMedia_IsActiveTrue(
            MediaAttachmentType attachableType,
            long attachableId,
            MediaFileType mediaType
    );

    @Query("""
            select attachment
            from MediaAttachment attachment
            join fetch attachment.media media
            where attachment.attachableType = :attachableType
              and attachment.mediaType = :mediaType
              and attachment.attachableId in :attachableIds
              and media.isActive = true
            """)
    List<MediaAttachment> findAllActiveAttachments(
            @Param("attachableType") MediaAttachmentType attachableType,
            @Param("mediaType") MediaFileType mediaType,
            @Param("attachableIds") Collection<Long> attachableIds
    );

}