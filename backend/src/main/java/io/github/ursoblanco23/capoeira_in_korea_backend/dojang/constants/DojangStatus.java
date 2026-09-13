package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.constants;

// 삭제 시 soft delete 처리
public enum DojangStatus {
    // 정상 공개
    ACTIVE,

    // 비공개, 복구나 최종 삭제가 결정되지 않은 상태 (= pending)
    HIDDEN,

    // deleted_at 칼럼 is not null 상태, 삭제 처리되어 일반적인 서비스 대상에서 제외됨
    DELETED,
}
