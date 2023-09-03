package com.itqf.spring.service;

import com.itqf.spring.entity.SysUser;
import com.itqf.spring.entity.WebMenu;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface ICommonService {
    public List<WebMenu> loadMenuByUserId(Integer userId);
}
