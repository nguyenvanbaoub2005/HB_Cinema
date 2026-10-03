package com.baobeodev.identity_service.mapper;

import com.baobeodev.identity_service.dto.request.ScheduleRequest;
import com.baobeodev.identity_service.dto.response.ScheduleResponse;
import com.baobeodev.identity_service.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {
  @Mapping(source = "branchId", target = "branch")
  @Mapping(source = "roomId", target = "room")
  @Mapping(source = "movieId", target = "movie")
  @Mapping(source = "startDateTime", target = "startDateTime")
  Schedule toEntity(ScheduleRequest scheduleRequest);

  @Mapping(source = "movie.title", target = "movieName")
  @Mapping(source = "branch.name", target = "branchName")
  //    @Mapping(source = "room.name", target = "roomName")
  ScheduleResponse toScheduleResponse(Schedule schedule);

  // Các phương thức ánh xạ bổ sung
  default Branch map(int branchId) {
    Branch branch = new Branch();
    branch.setId(branchId);
    return branch;
  }

  // Phương thức ánh xạ thủ công để chuyển đổi từ int thành Room
  default Room mapRoom(int roomId) {
    Room room = new Room();
    room.setId(roomId);
    return room;
  }

  // Phương thức ánh xạ thủ công để chuyển đổi từ int thành Movie
  default Movie mapMovie(int movieId) {
    Movie movie = new Movie();
    movie.setId(movieId);
    return movie;
  }
}
