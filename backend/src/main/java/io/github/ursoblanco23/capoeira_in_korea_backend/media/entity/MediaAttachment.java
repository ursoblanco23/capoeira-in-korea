package io.github.ursoblanco23.capoeira_in_korea_backend.media.entity;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "media_attachments"
)
public class MediaAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // media_id 외래키 → MediaFile 엔티티 참조
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "media_id", nullable = false)
    private MediaFile media;

    @Enumerated(EnumType.STRING)
    @Column(name = "attachable_type", nullable = false, length = 50)
    private MediaAttachmentType attachableType;

    @Column(name = "attachable_id", nullable = false)
    private Long attachableId;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", length = 20)
    @Builder.Default
    private MediaFileType mediaType = MediaFileType.GENERAL;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public MediaAttachment replaceMedia(MediaFile media) {
        this.media = media;
        return this;
    }
}
