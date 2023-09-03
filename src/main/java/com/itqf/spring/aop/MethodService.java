package com.itqf.spring.aop;

import org.springframework.stereotype.Service;

@Service
public class MethodService implements IMethodService {
    public void add(){
        System.out.println("new MethodService().add()");
    };
}
