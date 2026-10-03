package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.request.PermissionRequest;
import com.baobeodev.identity_service.dto.response.PermissionReponse;
import com.baobeodev.identity_service.entity.Permission;
import com.baobeodev.identity_service.mapper.PermissionMapper;
import com.baobeodev.identity_service.repository.PermissionRepository;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
// taoj cóntructor final
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionService {
  PermissionRepository permissionRepository;
  PermissionMapper permissionMapper;

  public PermissionReponse create(PermissionRequest request) {
    // chuyển đổi từ đối tượng PermissionRequest (thường chứa dữ liệu từ giao diện) sang đối tượng
    // Permission.
    Permission permission = permissionMapper.toPermission(request);
    permission = permissionRepository.save(permission);
    return permissionMapper.toPermissionReponse(permission);
    // Cuối cùng, permissionMapper.toPermissionReponse(permission) chuyển đổi đối tượng Permission
    // đã lưu thành PermissionResponse.
  }

  public List<PermissionReponse> getAll() {
    var permissions = permissionRepository.findAll();
    return permissions.stream().map(permissionMapper::toPermissionReponse).toList();
  }

  public void delete(String permission) {
    permissionRepository.deleteById(permission);
  }
}
