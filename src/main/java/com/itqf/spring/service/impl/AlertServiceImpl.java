package com.itqf.spring.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.itqf.spring.service.AlertService;
import com.itqf.spring.vo.request.ContractInfoRequest;
import com.itqf.spring.vo.request.UserRequest;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service("alertServiceImpl")
public class AlertServiceImpl implements AlertService {
    private Object contractInfoObject;
    @Autowired
    private RabbitTemplate rabbitTemplate;
    public void sendContractInfoAlert(ContractInfoRequest contractInfoRequest)
    {
        String contractInfoRequestStr= JSONObject.toJSONString(contractInfoRequest);
        rabbitTemplate.convertAndSend("spittle.alerts",contractInfoRequestStr);
    }
    ////rabbitmq消费消息（拉）
    @Override
    public String receive()
    {
        String message=(String)rabbitTemplate.receiveAndConvert();
        return message;
    }
}
