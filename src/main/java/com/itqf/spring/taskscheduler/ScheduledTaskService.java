package com.itqf.spring.taskscheduler;

import org.apache.ibatis.javassist.Loader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class ScheduledTaskService {
    @Autowired
    private RestTemplate restTemplate;

    private static final SimpleDateFormat dateFormat=new SimpleDateFormat("HH:mm:ss");
//    @Scheduled(fixedRate=5000)
//    public void reportCurrentTime() throws InterruptedException {
//        String formatDate=dateFormat.format(new Date());
//        System.out.println("每隔五秒执行一次"+formatDate);
//        Thread.sleep(10000L);
//        System.out.println("每隔五秒执行一次end"+formatDate);
//    }
    @Scheduled(cron="0 12 15 ? * *")
    public void FixTimeExecutionFirst()
    {

        String result= restTemplate.getForObject("http://192.168.0.101:9208/pay?id=21012345678902",String.class);
        //System.out.println("在指定时间"+dateFormat.format(new Date())+"执行");
        System.out.println(Thread.currentThread().getName()+"在指定时间"+dateFormat.format(new Date())+"调用pay接口，返回结果："+result);
    }
    @Scheduled(cron="0 12 15 ? * *")
    public void FixTimeExecutionSecond()
    {
        String result= restTemplate.getForObject("http://192.168.0.101:9209/pay?id=21012345678902",String.class);
        //System.out.println("在指定时间"+dateFormat.format(new Date())+"执行");
        System.out.println(Thread.currentThread().getName()+"在指定时间"+dateFormat.format(new Date())+"调用pay接口，返回结果："+result);
    }
}
