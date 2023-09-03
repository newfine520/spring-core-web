package com.itqf.spring.vo.response;

import lombok.Data;

@Data
public class ContractSendResponse {
    private String code;
    private String msg;
    private ContractSend result;
}
