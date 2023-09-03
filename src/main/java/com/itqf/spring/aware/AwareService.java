package com.itqf.spring.aware;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class AwareService  implements BeanNameAware, ResourceLoaderAware {
    private String beanName;
    private ResourceLoader loader;

    @Override
    public void setResourceLoader(ResourceLoader resourceLoader)
    {
        this.loader=resourceLoader;
    }
    @Override
    public void setBeanName(String name)
    {
        this.beanName=name;
    }
    public void outPutResult()
    {
        System.out.println("Bean的名称为："+beanName);
        Resource resource=loader.getResource("classpath:/test.txt");
        try
        {
            System.out.println("ResourceLoader 加载的文件内容为："+ IOUtils.toString(resource.getInputStream()));
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }



}
