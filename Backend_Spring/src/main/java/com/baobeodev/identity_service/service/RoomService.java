package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.request.RoomRequest;
import com.baobeodev.identity_service.dto.response.RoomResponse;
import com.baobeodev.identity_service.entity.Room;
import com.baobeodev.identity_service.mapper.RoomMapper;
import com.baobeodev.identity_service.repository.RoomRepository;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
// taoj cóntructor final
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j // cho ghi log
public class RoomService {
  RoomRepository roomRepository;
  RoomMapper roomMapper;

  public List<RoomResponse> getRoomsByBranch(int branchId) {
    return roomRepository.findByBranchId(branchId).stream()
        .map(roomMapper::toRoomResponse)
        .toList();
  }

  @PreAuthorize("hasRole('ADMIN')")
  public List<RoomResponse> getRooms() {
    return roomRepository.findAll().stream().map(roomMapper::toRoomResponse).toList();
  }

  @PreAuthorize("hasRole('ADMIN')")
  public RoomResponse createRoom(RoomRequest request) {
    Room room = roomMapper.toRoom(request);
    room = roomRepository.save(room);
    return roomMapper.toRoomResponse(room);
  }
}
