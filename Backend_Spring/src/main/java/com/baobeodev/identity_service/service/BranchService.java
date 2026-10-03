package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.request.BranchRequest;
import com.baobeodev.identity_service.dto.response.BranchResponse;
import com.baobeodev.identity_service.entity.Branch;
import com.baobeodev.identity_service.exception.AppException;
import com.baobeodev.identity_service.exception.ErrorCode;
import com.baobeodev.identity_service.mapper.BranchMapper;
import com.baobeodev.identity_service.repository.BranchRepository;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BranchService {
  BranchRepository branchRepository;
  BranchMapper branchMapper;

  @PreAuthorize("hasRole('ADMIN')")
  public BranchResponse createBranch(BranchRequest request) {
    if (branchRepository.existsByName(request.getName())) {
      throw new AppException(ErrorCode.BRANCH_EXISTED);
    }
    Branch branch = branchMapper.toBranch(request);
    branchRepository.save(branch);
    return branchMapper.toBranchResponse(branch);
  }

  public List<BranchResponse> getAllBranches() {
    return branchRepository.findAll().stream().map(branchMapper::toBranchResponse).toList();
  }

  @PreAuthorize("hasRole('ADMIN')")
  public void deleteBranch(int id) {
    branchRepository.deleteById(id);
  }
}
