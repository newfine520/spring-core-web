package com.itqf.spring.dao.UserDao.impl;

import com.github.javafaker.Faker;
import com.itqf.spring.dao.UserDao.UserDao;
import com.itqf.spring.entity.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class UserDaoImpl implements UserDao {
    public UserDaoImpl()
    {
        System.out.println("------------------UserDaoImpl构造函数");
    }

    @Override
    public List<User> findUsers(int howMany)
    {
     List<User> list=new ArrayList<>();
     Faker faker=new Faker(new Locale("zh-CN"));
     for(int i=0;i<howMany;i++)
     {
         User user=new User();
         user.setName(faker.name().fullName());
         user.setAge(faker.number().numberBetween(0,100));
         user.setPhone(faker.phoneNumber().cellPhone());
         user.setLocation(faker.address().city());
         list.add(user);
     }
     return list;
    }
}
