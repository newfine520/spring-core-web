package com.itqf.spring.dao.UserDao;

import com.itqf.spring.entity.User;

import java.util.List;

public interface UserDao {
    List<User> findUsers(int howMany);
}
