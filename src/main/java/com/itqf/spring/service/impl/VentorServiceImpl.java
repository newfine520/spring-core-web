package com.itqf.spring.service.impl;

import com.itqf.spring.service.iVentorService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class VentorServiceImpl implements iVentorService, InitializingBean {
    public VentorServiceImpl() {
        System.out.println("------------> VentorServiceImpl构造函数");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
    }
}
