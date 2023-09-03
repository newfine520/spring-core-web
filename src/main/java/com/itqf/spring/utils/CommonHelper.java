package com.itqf.spring.utils;

import io.swagger.annotations.ApiModelProperty;

import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class CommonHelper {
    public static List<KeyValue> GetEnum(Type t, boolean canEmpty)
    {
        //20211123 根据名称获取枚举值 todo
        //List<KeyValue> kv=new ArrayList<>();
        //String[] names=Enum.get
        return null;
    }

    public static Properties getApiModelProperty(String classPath)
    {
        Properties p = new Properties();
        try {
            // 1.根据类路径获取类
            Class<?> c = Class.forName(classPath);
            // 2.获取类的属性
            Field[] declaredFields = c.getDeclaredFields();
            // 3.遍历属性，获取属性上ApiModelProperty的值，属性的名，存入Properties
            if (declaredFields.length != 0) {
                for (Field field : declaredFields) {
                    if (field.getAnnotation(ApiModelProperty.class) != null) {
                        // key和value可根据需求存
                        // 这存的key为类属性名，value为注解的值
                        p.put(field.getName(),field.getAnnotation(ApiModelProperty.class).value());
                    }
                }
                return p;
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }
}
