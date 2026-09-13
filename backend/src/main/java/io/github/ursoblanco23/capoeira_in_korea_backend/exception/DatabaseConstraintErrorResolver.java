package io.github.ursoblanco23.capoeira_in_korea_backend.exception;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Component
public class DatabaseConstraintErrorResolver {

    private static final Map<String, ErrorCode> ERROR_CODES_BY_CONSTRAINT = Map.of(
            "uq_capoeira_dojangs_active_name_address",
            ErrorCode.DOJANG_DUPLICATE
    );

    public Optional<ErrorCode> resolve(Throwable throwable) {
        String constraintName = findConstraintName(throwable);

        if (constraintName == null) {
            return Optional.empty();
        }

        return Optional.ofNullable(ERROR_CODES_BY_CONSTRAINT.get(constraintName));
    }

    private String findConstraintName(Throwable throwable) {
        Throwable cause = throwable;

        while (cause != null) {
            if (cause instanceof org.hibernate.exception.ConstraintViolationException exception) {
                return exception.getConstraintName();
            }

            cause = cause.getCause();
        }

        return null;
    }
}
