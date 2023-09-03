package com.itqf.spring.service;

import com.itqf.spring.entity.Role;
import com.itqf.spring.entity.SysUser;
import com.itqf.spring.vo.request.UserRequest;
import com.itqf.spring.vo.response.MyResponseEntity;
import com.itqf.spring.vo.response.MyResponseForPage;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

public interface IRoleService {
   public List<Role> queryRole();
}
