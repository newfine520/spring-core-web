package com.itqf.spring.bean;

import com.alibaba.fastjson.JSONObject;
import com.itqf.spring.enums.SignStatusEnum;
import com.itqf.spring.service.QiyuesuoContractService;
import com.itqf.spring.vo.request.ContractInfoRequest;
import com.itqf.spring.vo.request.ContractSendRequest;
import com.itqf.spring.vo.request.QiyuesuoContractRequest;
import com.itqf.spring.vo.response.ContractSendResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.util.DigestUtils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
@Slf4j
public class ContractInfoHandler {
    @Autowired
    private QiyuesuoContractService qiyuesuoContractService;
    private ContractInfoRequest contractInfoRequest;
    //20211127rabbitmq消费端如何整合到service
    //2022092可用@PostConstruct（适用场景：消息组件的监听器、消息的确认机制） todo
    //rabbitmq消费消息（推）
    public void handleContractInfoAlert(String contractInfoStr)
    {
        Long timeStamp=new Date().getTime();
        //20211128 signature todo
        String signature= DigestUtils.md5DigestAsHex(("ehr2ISG"+timeStamp).getBytes());
        List<ContractInfoRequest> contractInfoRequestList=new ArrayList<>();
        contractInfoRequest= JSONObject.parseObject(contractInfoStr,ContractInfoRequest.class);
        ContractSendRequest contractSendRequest=new ContractSendRequest();
        contractSendRequest.setContractType(contractInfoRequest.getContractType());
        contractSendRequest.setContractTemplateEnum(contractInfoRequest.getContractTemplateEnum());
        contractSendRequest.setContractUserParam(JSONObject.toJSONString(contractInfoRequest.getTemplateParam()));
        contractSendRequest.setCategoryId(contractInfoRequest.getContractTemplateId());
        contractSendRequest.setSignerName(contractInfoRequest.getSignerName());
        contractSendRequest.setSignerContact(contractInfoRequest.getSignerContact());
        contractSendRequest.setCategoryName(contractInfoRequest.getContractTemplateName());
        contractSendRequest.setTimestamp(timeStamp);
        contractSendRequest.setSignature(signature);
        contractSendRequest.setIsNeedCompanySign(contractInfoRequest.getIsNeedCompanySign());
        //20211128 url todo
        ContractSendResponse contractSendResponse=qiyuesuoContractService.sendContract("https://plus-dev.ishanggang.com/api-user/v1/cms/contract-ehr/send",contractSendRequest);
        if(Objects.nonNull(contractSendResponse))
        {
            log.info("发起合同返回结果 code:{},msg:{},sendStatus:{},sendMessage:{}",contractSendResponse.getCode(),contractSendResponse.getMsg(),contractSendResponse.getResult().getSendStatus(),contractSendResponse.getResult().getSendMessage());
            //20211128 if(contractSendResponse.getCode()=="0")这么写貌似返回false
            if(contractSendResponse.getCode().equals("0"))
            {
                if(contractSendResponse.getResult().getSendStatus().equals(2))
                {
                    QiyuesuoContractRequest qiyuesuoContractRequest=new QiyuesuoContractRequest();
                    qiyuesuoContractRequest.setId(1);
                    qiyuesuoContractRequest.setContractId(contractSendResponse.getResult().getContractId());
                    qiyuesuoContractRequest.setContractNo(contractSendResponse.getResult().getContractNo());
                    qiyuesuoContractRequest.setSignStatus(0);
                    Timestamp d = new Timestamp(System.currentTimeMillis());//java获取取得Timestamp类型的当前系统时间 格式：2010-11-04 16:19:42
                    qiyuesuoContractRequest.setStartTime(d);
                    qiyuesuoContractRequest.setSendStatus(1);
                    qiyuesuoContractRequest.setContractResult(contractSendResponse.getResult().getContractResult());
                    qiyuesuoContractRequest.setSenderMobile(contractSendResponse.getResult().getSenderMobile());
                    qiyuesuoContractService.saveOrUpdate(qiyuesuoContractRequest);
                }
            }
        }
    }
}

