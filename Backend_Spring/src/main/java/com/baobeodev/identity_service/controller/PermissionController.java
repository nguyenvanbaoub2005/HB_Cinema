package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.request.PermissionRequest;
import com.baobeodev.identity_service.dto.response.PermissionReponse;
import com.baobeodev.identity_service.service.PermissionService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
  PermissionService permissionService;

  @PostMapping
  // @RequestBody: Chuyển đổi JSON từ yêu cầu thành đối tượng PermissionRequest.
  ApiResponse<PermissionReponse> create(@RequestBody PermissionRequest request) {
    return ApiResponse.<PermissionReponse>builder()
        .result(permissionService.create(request))
        .build();
  }

  @GetMapping
  ApiResponse<List<PermissionReponse>> getAll() {
    return ApiResponse.<List<PermissionReponse>>builder()
        .result(permissionService.getAll())
        .build();
  }

  @DeleteMapping("/{permission}")
  // @PathVariable lấy tham số trực tiếp từ url
  ApiResponse<Void> delete(@PathVariable String permission) {
    permissionService.delete(permission);
    return ApiResponse.<Void>builder().build();
  }
}
