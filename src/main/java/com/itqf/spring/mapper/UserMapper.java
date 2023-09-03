package com.itqf.spring.mapper;
import com.itqf.spring.entity.SysUser;
import com.itqf.spring.vo.request.UserRequest;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface UserMapper {
public List<SysUser> queryByUserName(@Param("userName") String userName);
    int addSysUser(@Param("ur")UserRequest userRequest);
    List<SysUser> sysUserList(@Param("userRequest")UserRequest userRequest);
}
