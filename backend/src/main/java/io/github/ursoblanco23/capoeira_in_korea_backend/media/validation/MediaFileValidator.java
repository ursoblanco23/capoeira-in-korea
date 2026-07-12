package io.github.ursoblanco23.capoeira_in_korea_backend.media.validation;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import org.springframework.web.multipart.MultipartFile;

public interface MediaFileValidator {

    boolean supports(MediaFileType mediaFileType);

    void validate(MultipartFile file);

}
