package com.itqf.spring.service.impl;

import com.itqf.spring.dao.UserDao.UserDao;
import com.itqf.spring.entity.User;
import com.itqf.spring.service.ConsumerService;

import java.util.List;

public class ConsumerServiceImpl implements ConsumerService {

    private UserDao userDao;

    public void setUserDao(UserDao userDao)
    {
        this.userDao=userDao;
    }
    @Override
    public List<User> findUsers()
    {
        return userDao.findUsers(10);
    }
    @Override
    public List<com.itqf.spring.entity.User> findUsers(int howMany)
    {
       return userDao.findUsers(howMany);
    }
}
