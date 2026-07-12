package io.github.ursoblanco23.capoeira_in_korea_backend.user.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.RoleName;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserRoleDto {

    private long id;
    private RoleName roleName;
    private String displayName;

    public static UserRoleDto from(Role role) {
        return new UserRoleDto(role.getId(), role.getRoleName(), role.getDisplayName());
    }

}
