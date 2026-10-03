package com.baobeodev.identity_service.repository;

import com.baobeodev.identity_service.entity.Ticket;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
  List<Ticket> findByBill_Id(Integer billId);
}
