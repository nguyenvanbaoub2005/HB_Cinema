package com.baobeodev.identity_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Data
@Table(name = "room")
@Entity
@NoArgsConstructor
public class Room {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  int id;

  String name;
  int capacity;
  double totalArea;
  String imgURL;

  @ManyToOne
  @JoinColumn(nullable = false, name = "branch_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  Branch branch;
}
