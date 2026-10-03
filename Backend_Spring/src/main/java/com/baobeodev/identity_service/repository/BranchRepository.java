package com.baobeodev.identity_service.repository;

import com.baobeodev.identity_service.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Integer> {
  boolean existsByName(String name);
}
