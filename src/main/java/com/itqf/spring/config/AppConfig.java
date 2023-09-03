package com.itqf.spring.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import javax.sql.DataSource;

@Configuration
@ComponentScan(basePackages = "com.itqf.spring.bean")
//@ComponentScan("com.itqf.spring.bean")
public class AppConfig {
    @Bean
    public DataSource dataSource(){
        DruidDataSource datasource = new DruidDataSource();
        return datasource;
    }
}
