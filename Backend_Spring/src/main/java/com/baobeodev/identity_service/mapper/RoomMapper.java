package com.baobeodev.identity_service.mapper;

import com.baobeodev.identity_service.dto.request.RoomRequest;
import com.baobeodev.identity_service.dto.response.RoomResponse;
import com.baobeodev.identity_service.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoomMapper { // ánh xạ trực tiếp đối tượng Branch
  @Mapping(
      source = "branchId",
      target = "branch.id") // ánh xạ branchId trong RoomRequest sang branch.id
  Room toRoom(RoomRequest request);

  @Mapping(target = "branchId", source = "branch.id")
  RoomResponse toRoomResponse(Room room);
}
