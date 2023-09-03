package com.itqf.spring.service;

import com.itqf.spring.entity.User;

import java.util.List;

public interface ConsumerService {
    List<User> findUsers();
    List<User> findUsers(int howMany);
}
