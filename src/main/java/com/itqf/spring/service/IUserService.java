package com.itqf.spring.service;

import com.itqf.spring.entity.SysUser;
import com.itqf.spring.entity.User;
import com.itqf.spring.vo.request.UserRequest;
import com.itqf.spring.vo.response.ContractUserResponse;
import com.itqf.spring.vo.response.MyResponseEntity;
import com.itqf.spring.vo.response.MyResponseForPage;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

public interface IUserService extends UserDetailsService {
      SysUser getUserInfoByUsername(String s);
      MyResponseEntity upload(CommonsMultipartFile file, HttpServletRequest request) throws IOException;
      int saveOrUpdate(UserRequest userRequest);
      MyResponseForPage sysUserList(UserRequest userRequest);
      List<UserRequest> userRequestList(UserRequest userRequest);
      List<ContractUserResponse> contractUserList(UserRequest userRequest);
}
