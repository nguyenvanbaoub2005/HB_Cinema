package com.baobeodev.identity_service.repository;

import com.baobeodev.identity_service.entity.Seat;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Integer> {
  List<Seat> findByRoomId(int roomid);
}
