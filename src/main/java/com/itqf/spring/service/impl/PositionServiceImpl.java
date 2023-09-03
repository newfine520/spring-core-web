package com.itqf.spring.service.impl;

import com.itqf.spring.entity.Position;
import com.itqf.spring.entity.Role;
import com.itqf.spring.mapper.PositionMapper;
import com.itqf.spring.mapper.RoleMapper;
import com.itqf.spring.service.IPositionService;
import com.itqf.spring.service.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("positionServiceImpl")
public class PositionServiceImpl implements IPositionService {
    @Autowired
    public PositionMapper positionMapper;
    public List<Position> queryPosition(){
        return positionMapper.queryPosition();
    }
}
