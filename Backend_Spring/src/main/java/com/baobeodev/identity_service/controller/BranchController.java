package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.request.BranchRequest;
import com.baobeodev.identity_service.dto.response.BranchResponse;
import com.baobeodev.identity_service.service.BranchService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/branch")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BranchController {
  BranchService branchService;

  @PostMapping
  public ApiResponse<BranchResponse> createBranch(@RequestBody BranchRequest request) {
    return ApiResponse.<BranchResponse>builder().result(branchService.createBranch(request)).build();
  }

  @GetMapping
  public ApiResponse<List<BranchResponse>> getAllBranches() {
    List<BranchResponse> branches = branchService.getAllBranches();
    return ApiResponse.<List<BranchResponse>>builder().result(branches).build();
  }

  @DeleteMapping("/{id}")
  ApiResponse<String> deleteBranch(@PathVariable("id") int id) {
    branchService.deleteBranch(id);
    return ApiResponse.<String>builder().result("Branch has been deleted").build();
  }
}
