package com.itqf.spring.vo.request;

import lombok.Data;

@Data
public class ContractSendRequest {
    private String contractType;
    private Integer contractTemplateEnum;
    private String contractUserParam;
    private String categoryId;
    private String signerName;
    private String signerContact;
    private String categoryName;
    private Long timestamp;
    private String signature;
    private Integer isNeedCompanySign;
}
