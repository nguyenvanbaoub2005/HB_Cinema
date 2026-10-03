package com.baobeodev.identity_service.mapper;

import com.baobeodev.identity_service.dto.response.BillResponse;
import com.baobeodev.identity_service.entity.Bill;
import com.baobeodev.identity_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BillMapper {

  BillResponse toBillResponse(Bill bill);

  @Mapping(target = "user", ignore = true)
  Bill toEntity(BillResponse billResponse);

  default User map(String userId) {
    User user = new User();
    user.setId(userId);
    return user;
  }
}
