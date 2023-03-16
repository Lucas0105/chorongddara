package com.ssafy.chorongddara.api.service;


import com.ssafy.chorongddara.api.request.UserJoinReq;
import com.ssafy.chorongddara.db.entity.User;

import java.util.Optional;

public interface UserService {
    void join(UserJoinReq userJoinReq);
    Optional<User> getUserByEmail(String email);
//    Optional<User> login(String email);
}
