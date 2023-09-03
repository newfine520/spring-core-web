package com.itqf.spring.bean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component("personName")
public class Person {
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public void jump()
    {
        System.out.println("--------------jump high");
    }

    public Integer getAge() {
        return age;
    }

    @Value("设置成员变量的值")
    private String name;

    @Value("18")
    public void setAge(Integer age) {
        this.age = age;
    }

    private Integer age;

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    private  Car car;
    private  Integer height;
    public Person() {
        System.out.println("------------> Person.Person构造函数");
    }
    public Person(String argName,int argAge)
    {
        this.name=argName;
        this.age=argAge;
    }
    public Person(String name,Car car)
    {
        super();
        System.out.println("Person(String name, Car car)");
        this.car=car;
        this.name=name;
        System.out.println("Person的有参构造方法"+name+car);
    }
    public Person(Car car,String name)
    {
        super();
        System.out.println("Person(Car car, String name)");
        this.car=car;
        this.name=name;
        System.out.println("Person的有参构造方法"+name+car);
    }
    public Person(Car car,Integer name)
    {
        super();
        System.out.println("Person(Car car, Integer name)");
        this.car=car;
        this.height=name;
        System.out.println("Person的有参构造方法"+name+car);
    }

    public Car getCzar() {
        return czar;
    }
    public void setCzar(Car czar) {
        this.czar = czar;
    }

//    @Autowired
    @Resource
    //@Qualifier("baoma")
//    @Resource(name="aodi")
    private Car czar;
    //getter,setter
}
