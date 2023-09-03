package com.itqf.spring.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.itqf.spring.entity.Role;
import com.itqf.spring.entity.SysUser;
import com.itqf.spring.mapper.RoleMapper;
import com.itqf.spring.mapper.UserMapper;
import com.itqf.spring.service.IRoleService;
import com.itqf.spring.service.IUserService;
import com.itqf.spring.utils.FileUtil;
import com.itqf.spring.utils.excel.EasyPoiExcelUtil;
import com.itqf.spring.vo.request.UserRequest;
import com.itqf.spring.vo.response.MyResponseEntity;
import com.itqf.spring.vo.response.MyResponseForPage;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service("roleServiceImpl")
public class RoleServiceImpl implements IRoleService {
    @Autowired
    public RoleMapper roleMapper;
    public List<Role> queryRole(){
        return roleMapper.queryRole();
    }
}
