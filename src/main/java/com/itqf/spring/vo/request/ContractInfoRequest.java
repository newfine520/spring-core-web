package com.itqf.spring.vo.request;

import com.itqf.spring.utils.KeyValue;
import lombok.Data;

import java.util.List;

@Data
public class ContractInfoRequest {
    private List<KeyValue> templateParam;
    private String contractTemplateId;
    private String contractTemplateName;
    private Integer contractTemplateEnum;
    private String contractType;
    private String signerName;
    private String signerContact;
    private Integer isNeedCompanySign;
}
