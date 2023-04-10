package com.ssafy.chorongddara.db.entity;

import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@DynamicInsert
@DynamicUpdate
public class Star {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer starId;

    private Integer starPose;

    private Integer starQuiz;

    private Integer starAr;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultural_property_id")
    private CulturalProperty culturalProperty;

    public void completePose() {
        this.starPose = 1;
    }

    public void completeQuiz() {
        this.starQuiz = 1;
    }

    public void completeAr() {
        this.starAr = 1;
    }
}
