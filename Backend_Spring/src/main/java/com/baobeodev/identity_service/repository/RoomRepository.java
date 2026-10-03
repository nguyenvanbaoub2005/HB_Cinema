package com.baobeodev.identity_service.repository;

import com.baobeodev.identity_service.entity.Room;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
  List<Room> findByBranchId(int branchId); // Tìm các phòng theo ID chi nhánh
}
