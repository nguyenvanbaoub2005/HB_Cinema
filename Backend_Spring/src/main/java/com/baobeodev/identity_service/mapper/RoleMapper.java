package com.baobeodev.identity_service.mapper;

import com.baobeodev.identity_service.dto.request.RoleRequest;
import com.baobeodev.identity_service.dto.response.RoleResponse;
import com.baobeodev.identity_service.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

  // Ánh xạ từ RoleRequest sang Role
  @Mapping(target = "permissions", ignore = true) // Lấy permissions từ RoleRequest
  Role toRole(RoleRequest request);

  // Ánh xạ từ Role sang RoleResponse
  RoleResponse toRoleResponse(Role role);
}
