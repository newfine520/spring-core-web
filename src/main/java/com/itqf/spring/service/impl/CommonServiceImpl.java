package com.itqf.spring.service.impl;
import com.itqf.spring.entity.SysUser;
import com.itqf.spring.entity.WebMenu;
import com.itqf.spring.mapper.CommonMapper;
import com.itqf.spring.mapper.UserMapper;
import com.itqf.spring.service.ICommonService;
import com.itqf.spring.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("commonServiceImpl")
public class CommonServiceImpl implements ICommonService {
    @Autowired
    public CommonMapper commonMapper;
    @Override
    public List<WebMenu> loadMenuByUserId(Integer userId)
    {
        return commonMapper.loadMenuByUserId(userId);
    }
}
