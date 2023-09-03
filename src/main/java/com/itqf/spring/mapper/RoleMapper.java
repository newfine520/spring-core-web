package com.itqf.spring.mapper;

import com.itqf.spring.entity.Role;
import com.itqf.spring.entity.SysUser;
import com.itqf.spring.vo.request.UserRequest;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RoleMapper {
    List<Role> queryRole();
}
