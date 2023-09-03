package com.itqf.spring.controller;

import com.itqf.spring.entity.WebMenu;
import com.itqf.spring.service.AlertService;
import com.itqf.spring.service.ICommonService;
import com.itqf.spring.utils.KeyValue;
import com.itqf.spring.vo.request.ContractInfoRequest;
import com.itqf.spring.vo.request.UserRequest;
import com.itqf.spring.vo.response.MyResponseEntity;
import org.omg.CORBA.PUBLIC_MEMBER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.util.ArrayList;
import java.util.List;

@RestController
public class CommonController {
    @Autowired
    private ICommonService commonService;
    @Autowired
    private AlertService alertService;
    @RequestMapping(value = "/loadmenu",method = RequestMethod.POST)
    public Object loadMenu()
    {
        MyResponseEntity<List<WebMenu>> response=new MyResponseEntity<List<WebMenu>>();
        List<WebMenu> responses=commonService.loadMenuByUserId(4371);
        if(CollectionUtils.isEmpty(responses))
        {
            response.setCode(-1);
            response.setMsg("失败！");
        }
        else
        {
            response.setData(commonService.loadMenuByUserId(4371));
            response.setCode(0);
            response.setMsg("成功！");
        }
        return response;
    }
    @GetMapping("/send")
    public void send() {
        ContractInfoRequest contractInfoRequest=new ContractInfoRequest();
        List<KeyValue> keyValueList=new ArrayList<>();
        KeyValue keyValue=new KeyValue();
        keyValue.setName("这是来自AMQP的一条消息");
        keyValue.setValue("我是RabbitMQ消息队列中的一条消息。。。");
        keyValueList.add(keyValue);
        contractInfoRequest.setTemplateParam(keyValueList);
        alertService.sendContractInfoAlert(contractInfoRequest);
    }
    @GetMapping("/receive")
    public String receive() {
        String str=alertService.receive();
        return str;
    }
}
