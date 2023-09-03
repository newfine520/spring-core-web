package com.itqf.spring.bean;

import org.springframework.stereotype.Component;

@Component
//@Component("aodi")
public class Aodi implements ICar {
    public void log()
    {
        System.out.println("奥迪");
    }

}



