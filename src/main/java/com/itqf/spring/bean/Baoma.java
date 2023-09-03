package com.itqf.spring.bean;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
//@Component("baoma")
public class Baoma implements ICar {
    public  void log()
    {
        System.out.println("宝马");
    }
}
