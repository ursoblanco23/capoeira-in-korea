package io.github.ursoblanco23.capoeira_in_korea_backend.media.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageMetadata implements MediaMetadata {
    private Integer width;
    private Integer height;
}
