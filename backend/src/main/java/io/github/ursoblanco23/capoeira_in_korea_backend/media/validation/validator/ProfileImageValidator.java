package io.github.ursoblanco23.capoeira_in_korea_backend.media.validation.validator;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.MediaValidationPolicy;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.resolver.MediaValidationPolicyResolver;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.validation.MediaFileValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
public class ProfileImageValidator implements MediaFileValidator {

    private final MediaFileValidationSupport validationSupport;
    private final MediaValidationPolicyResolver mediaValidationPolicyResolver;

    @Override
    public boolean supports(MediaFileType mediaFileType) {
        return mediaFileType == MediaFileType.PROFILE_IMAGE;
    }

    @Override
    public void validate(MultipartFile file) {
        MediaValidationPolicy policy =
                mediaValidationPolicyResolver.resolve(MediaFileType.PROFILE_IMAGE);

        validationSupport.validateNotEmpty(file);
        validationSupport.validateSize(file, policy);
        validationSupport.validateMimeType(file, policy);
        validationSupport.validateExtension(file, policy);
    }
}

