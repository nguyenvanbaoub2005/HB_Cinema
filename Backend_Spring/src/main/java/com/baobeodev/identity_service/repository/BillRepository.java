package com.baobeodev.identity_service.repository;

import com.baobeodev.identity_service.entity.Bill;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
  List<Bill> findByUser_Username(String username);

  List<Bill> findByUser_Id(String Id);
}
