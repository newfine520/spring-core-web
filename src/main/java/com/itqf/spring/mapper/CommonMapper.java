package com.itqf.spring.mapper;

import com.itqf.spring.entity.SysUser;
import com.itqf.spring.entity.WebMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CommonMapper {
    public List<WebMenu> loadMenuByUserId(@Param("userId") Integer userId);
}
