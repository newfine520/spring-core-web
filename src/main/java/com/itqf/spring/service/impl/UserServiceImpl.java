package com.itqf.spring.service.impl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import com.itqf.spring.dao.UserDao.UserDao;
import com.itqf.spring.dao.UserDao.impl.UserDaoImpl;
import com.itqf.spring.entity.SysUser;
import com.itqf.spring.enums.LeaveReasonEnum;
import com.itqf.spring.mapper.UserMapper;
import com.itqf.spring.service.IUserService;
import com.itqf.spring.utils.FileUtil;
import com.itqf.spring.utils.excel.EasyPoiExcelUtil;
import com.itqf.spring.vo.request.UserRequest;
import com.itqf.spring.vo.response.ContractUserResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service("userServiceImpl")
public class UserServiceImpl implements IUserService {


    @Autowired
    public UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        List<SysUser> userBeanList = userMapper.queryByUserName(s);
        if (userBeanList != null && userBeanList.size() == 1) {
            SysUser userBean = userBeanList.get(0);
            if (userBean != null) {
                // 账号存在 给当前登录的账号 授权相关的角色
                List<SimpleGrantedAuthority> authr = new ArrayList<>();
                authr.add(new SimpleGrantedAuthority("ROLE_USER"));
                UserDetails user = new User(s, userBean.getPassword()
                        , true
                        , true
                        , true
                        , true
                        , authr);
                return user;
            }
        }
        return null;
    }

    @Override
    public SysUser getUserInfoByUsername(String s) {
        SysUser userBean = null;
        List<SysUser> userBeanList = userMapper.queryByUserName(s);
        if (userBeanList != null && userBeanList.size() == 1) {
            userBean = userBeanList.get(0);
        }
        return userBean;
    }
    @Override
    public MyResponseEntity upload(CommonsMultipartFile file, HttpServletRequest request) throws IOException {
        //获取上传excel绝对路径
        String filePath = FileUtil.fileUpload(file, request);
        //20211121 判断文件路径非空（StringUtils.isBlank）todo
        if ("".equals(filePath)) {
            return MyResponseEntity.error("文件上传失败");
        }
        filePath="/Users/yangerlei/Downloads/人员导入模板.xlsx";
        List<UserRequest> userRequestList = EasyPoiExcelUtil.importExcel(filePath, 0, 1, UserRequest.class);

        if (CollectionUtils.isEmpty(userRequestList)) {
            return MyResponseEntity.success();
        }
        //循环导入数据
        String errorMessage = "";
        for (int i = 0; i < userRequestList.size(); i++) {
            UserRequest ur = userRequestList.get(i);
            //20211121判断是否缺少字段（StringUtils.isBlank） todo
            if (StringUtils.isEmpty(ur.getUserName())
                    || StringUtils.isEmpty(ur.getPositionId())
                    || StringUtils.isEmpty(ur.getMobile())
                    || StringUtils.isEmpty(ur.getServiceStatusCode())) {
                errorMessage += "[第" + i + "行]--缺少必填字段信息;";
                continue;
            }
          this.saveOrUpdate(ur);
        }
        return MyResponseEntity.success();
    }
    @Override
    public int saveOrUpdate(UserRequest userRequest)
    {
        return userMapper.addSysUser(userRequest);
    }
    @Override
    public MyResponseForPage sysUserList(UserRequest userRequest)
    {
        MyResponseForPage myResponseForPage=new MyResponseForPage();
        List<SysUser> sysUserList= userMapper.sysUserList(userRequest);
        if (CollectionUtils.isEmpty(sysUserList)) {
            return myResponseForPage;
        }


        if(userRequest.getPage()!=null&&userRequest.getLimit()!=null)
        {
            PageHelper.startPage(userRequest.getPage(),userRequest.getLimit());
            sysUserList=userMapper.sysUserList(userRequest);
            PageInfo<SysUser> pageInfo=new PageInfo<>(sysUserList);
            userRequest.setCount(pageInfo.getTotal());
        }
        List<UserRequest> list1 = sysUserList.stream().map(a -> {
            UserRequest response = new UserRequest();
            BeanUtils.copyProperties(a, response);
            return response;
        }).collect(Collectors.toList());
        myResponseForPage.setRows(list1);
        myResponseForPage.setTotal(userRequest.getCount());
        myResponseForPage.setPage(userRequest.getPage());
        myResponseForPage.setLimit(userRequest.getLimit());
        return myResponseForPage;
    }
    @Override
    public List<UserRequest> userRequestList(UserRequest userRequest)
    {
        List<SysUser> sysUserList=userMapper.sysUserList(userRequest);
        List<UserRequest> list1 = sysUserList.stream().map(a -> {
            UserRequest response = new UserRequest();
            BeanUtils.copyProperties(a, response);
            return response;
        }).collect(Collectors.toList());
        return list1;
    }
    @Override
    public List<ContractUserResponse> contractUserList(UserRequest userRequest)
    {
        List<SysUser> sysUserList= userMapper.sysUserList(userRequest);
        List<ContractUserResponse> contractUserResponsesList=new ArrayList<>();
        sysUserList.forEach(sysUser->{
            ContractUserResponse contractUserResponse=new ContractUserResponse();
            contractUserResponse.setStaffName(sysUser.getUserName());
            contractUserResponse.setStaffName2(sysUser.getUserName());
            contractUserResponse.setPositionName(sysUser.getPositionId());
            contractUserResponse.setStartTime(sysUser.getEntryDate());
            contractUserResponse.setLeaveDate(sysUser.getLeaveDate());
            contractUserResponse.setLeaveDate2(sysUser.getLeaveDate());
            contractUserResponse.setLeaveDate3(sysUser.getLeaveDate());
            contractUserResponse.setLeaveDate4(sysUser.getLeaveDate());
            contractUserResponse.setDirectorSuperior(sysUser.getParentName());
            contractUserResponse.setDirectorSuperior2(sysUser.getParentName());
            contractUserResponse.setSupervisor(sysUser.getParentName());
            contractUserResponse.setSupervisor2(sysUser.getParentName());
            contractUserResponse.setSupervisor3(sysUser.getParentName());
            contractUserResponse.setOA(sysUser.getParentName());
            contractUserResponse.setOA2(sysUser.getParentName());
            contractUserResponse.setReason(LeaveReasonEnum.Carrior.getName());
            contractUserResponse.setMobile(sysUser.getMobile());
            contractUserResponsesList.add(contractUserResponse);
        });
        return contractUserResponsesList;
    }



}
