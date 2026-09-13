package io.github.ursoblanco23.capoeira_in_korea_backend.exception;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DatabaseConstraintErrorResolverTest {

    private final DatabaseConstraintErrorResolver resolver =
            new DatabaseConstraintErrorResolver();

    @Test
    void resolvesDojangUniqueIndexViolationToDuplicateError() {
        org.hibernate.exception.ConstraintViolationException constraintViolation =
                mock(org.hibernate.exception.ConstraintViolationException.class);
        when(constraintViolation.getConstraintName())
                .thenReturn("uq_capoeira_dojangs_active_name_address");
        DataIntegrityViolationException exception =
                new DataIntegrityViolationException("Duplicate dojang", constraintViolation);

        assertThat(resolver.resolve(exception))
                .contains(ErrorCode.DOJANG_DUPLICATE);
    }

    @Test
    void doesNotResolveUnknownConstraintViolation() {
        org.hibernate.exception.ConstraintViolationException constraintViolation =
                mock(org.hibernate.exception.ConstraintViolationException.class);
        when(constraintViolation.getConstraintName())
                .thenReturn("uq_unknown_constraint");
        DataIntegrityViolationException exception =
                new DataIntegrityViolationException("Unknown violation", constraintViolation);

        assertThat(resolver.resolve(exception)).isEmpty();
    }
}
