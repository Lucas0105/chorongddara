package com.ssafy.chorongddara.db.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Pose {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer poseId;
    @Column(nullable = false, length = 50)
    private String poseName;
    @Column(nullable = false)
    private String posePicture;
}
