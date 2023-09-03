package com.itqf.spring.aware.impl;

import com.itqf.spring.aware.AwareTestService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.StringValueResolver;

import java.util.Locale;

/**
 * spring框架提供了多个*Aware接口，用于辅助Spring Bean编程访问Spring容器。
 * 通过实现这些接口，可以增强Spring Bean的功能，将一些特殊的spring内部bean暴露给业务应用
 */
public class AwareTestServiceImpl implements AwareTestService {
    ApplicationContext applicationContext;
    ApplicationEventPublisher applicationEventPublisher;
    StringValueResolver stringValueResolver;
    Environment environment;
    MessageSource messageSource;
    ResourceLoader resourceLoader;
    public void test()
    {
        System.out.println("Spring中的6大自动注入aware接口");
        System.out.println(this.applicationContext.containsBean("awareTestService"));
        System.out.println(this.environment.getProperty("java.home"));
        System.out.println(this.stringValueResolver.resolveStringValue("${java.runtime.version}"));
        System.out.println(this.resourceLoader.getResource("classpath:src/main/resources/ioc/services.xml"));
        System.out.println(this.applicationEventPublisher);
        System.out.println(this.messageSource.getMessage("Message",null,"not exist", Locale.JAPAN));
    }
    @Override
    public void setApplicationContext(ApplicationContext applicationContext)
    {
        this.applicationContext=applicationContext;
    }
    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher)
    {
        this.applicationEventPublisher=applicationEventPublisher;
    }
    @Override
    public void setEnvironment(Environment environment)
    {
        this.environment=environment;
    }
    @Override
    public void setResourceLoader(ResourceLoader resourceLoader)
    {
        this.resourceLoader=resourceLoader;
    }

    @Override
    public void setEmbeddedValueResolver(StringValueResolver stringValueResolver) {
        this.stringValueResolver=stringValueResolver;
    }

    @Override
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource=messageSource;
    }
}
