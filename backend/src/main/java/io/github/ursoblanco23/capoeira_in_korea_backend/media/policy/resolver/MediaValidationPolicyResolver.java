package io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.resolver;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.MediaValidationPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MediaValidationPolicyResolver {

    private final List<MediaValidationPolicy> policies;

    public MediaValidationPolicy resolve(MediaFileType mediaFileType) {
        return policies.stream()
                .filter(policy -> policy.supports(mediaFileType))
                .findFirst()
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.MEDIA_UNSUPPORTED_TYPE,
                        "지원하지 않는 미디어 검증 정책입니다."
                ));
    }
}
