package com.baobeodev.identity_service.mapper;

import com.baobeodev.identity_service.dto.request.BranchRequest;
import com.baobeodev.identity_service.dto.response.BranchResponse;
import com.baobeodev.identity_service.entity.Branch;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BranchMapper {
  @Mapping(source = "image", target = "image")
  Branch toBranch(BranchRequest request);

  BranchResponse toBranchResponse(Branch branch);
}
