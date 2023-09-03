package com.itqf.spring.bean;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;

public class MyAdvice {

    public void beforeConsumerService(JoinPoint jp)
    {
        System.out.println("---------before");
    }
    public void afterConsumerService(JoinPoint jp)
    {
        System.out.println("-----------after");
    }
    public Object aroundConsumerService(ProceedingJoinPoint p) throws Throwable {
        System.out.println("------------around before");
        // 执行切点方法
        Object result=p.proceed();
        System.out.println("------------around after");
        return result;
    }
    public void afterReturningConsumerService(JoinPoint jp)
    {
        System.out.println("------------afterReturning");
    }
    public void afterThrowingConsumerService(JoinPoint jp)
    {
        System.out.println("-----------------afterThrowing");
    }
}
