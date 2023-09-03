package com.itqf.spring.bean;

import org.springframework.stereotype.Component;

public class Car {
    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    private String name;

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    private String color;
}
