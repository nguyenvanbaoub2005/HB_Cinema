package com.baobeodev.identity_service.mapper;

import com.baobeodev.identity_service.dto.request.PermissionRequest;
import com.baobeodev.identity_service.dto.response.PermissionReponse;
import com.baobeodev.identity_service.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
  // toPermission chuyển đổi  PermissionRequest thành Permission
  Permission toPermission(PermissionRequest request);

  // toPermissionReponse chuyển đổi Permission(dữ liệu của database trả về ngươi dùng) thành reponse
  PermissionReponse toPermissionReponse(Permission permission);
}
