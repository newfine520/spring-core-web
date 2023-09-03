package com.itqf.spring.aop;

import com.itqf.spring.annotation.Action;
import javassist.bytecode.SignatureAttribute;
import org.aopalliance.intercept.Joinpoint;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Aspect
@Component
public class LogAspect {
    @Pointcut("@annotation(com.itqf.spring.annotation.Action)")
    public void annotationPointCut(){};
    @After("annotationPointCut()")
    public  void after(JoinPoint joinPoint)
    {
        MethodSignature signature=(MethodSignature) joinPoint.getSignature();
        Method method=signature.getMethod();
        Action action=method.getAnnotation(Action.class);
        System.out.println("注解式拦截"+action.name());
    }
//    @Before("execution(* com.itqf.spring.aop.MethodService.*(..))")
//    public void before(JoinPoint joinPoint)
//    {
//        MethodSignature signature=(MethodSignature) joinPoint.getSignature();
//        Method method=signature.getMethod();
//        System.out.println("方法规则式拦截，"+method.getName());
//    }
    //配置切入点，该方法无方法体，主要是为了方便同类中其他方法使用此处配置的切入点
    @Pointcut("execution(* com.itqf.spring.aop.MethodService.*(..))")
    public void methodPointCut(){}
    @Before("methodPointCut()")
    public void before(JoinPoint jointPoint)
    {
        MethodSignature signature=(MethodSignature) jointPoint.getSignature();
        Method method=signature.getMethod();
        System.out.println("方法规则式拦截"+method.getName());
    }
}
