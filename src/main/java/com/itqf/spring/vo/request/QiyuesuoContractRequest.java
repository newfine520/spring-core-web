package com.itqf.spring.vo.request;

import java.sql.Timestamp;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class QiyuesuoContractRequest {
    private Integer id;
    private String contractNo;
    private Long categoryId;
    private String contractName;
    private String signName;
    private Integer signStatus;
    private Timestamp signTime;
    private Timestamp startTime;
    private Timestamp endTime;
    private Long contractId;
    private Timestamp sendTime;
    private Integer sendStatus;
    private String sendParam;
    private String contractResult;
    private String senderMobile;
    private String contractUrl;
}
