package io.github.ursoblanco23.capoeira_in_korea_backend.auth.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.ApiError;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.ApiResponse;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class SecurityErrorResponseWriter {

    private final ObjectMapper objectMapper;

    public void writeErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        ApiResponse<Void> apiResponse = ApiResponse.error(ApiError.from(errorCode));

        response.setStatus(errorCode.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        objectMapper.writeValue(response.getWriter(), apiResponse);
    }

}
