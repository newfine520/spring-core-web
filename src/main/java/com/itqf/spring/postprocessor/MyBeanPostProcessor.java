package com.itqf.spring.postprocessor;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

public class MyBeanPostProcessor implements BeanPostProcessor {

    public MyBeanPostProcessor()
    {
        System.out.println("--------MyBeanPostProcessor构造函数");
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化before--实例化的bean对象之前："+bean+"\t"+beanName);
        return bean;
    }
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化after--实例化的bean对象之后："+bean+"\t"+beanName);
        return bean;
    }
}
