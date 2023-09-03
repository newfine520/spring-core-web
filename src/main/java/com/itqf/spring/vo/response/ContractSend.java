package com.itqf.spring.vo.response;

import lombok.Data;

@Data
public class ContractSend {
    private String sendMessage;
    private String contractNo;
    private Long contractId;
    private String contractResult;
    private String sendParam;
    private Integer sendStatus;
    private String signStatus;
    private String senderMobile;
}
