package com.baobeodev.identity_service.entity;

import jakarta.persistence.*;
import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Entity
public class Role {
  @Id String name;
  String description;
  @ManyToMany Set<Permission> permissions;
}
