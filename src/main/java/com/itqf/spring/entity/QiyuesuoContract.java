package com.itqf.spring.entity;

import com.sun.jmx.snmp.Timestamp;
import lombok.Data;

@Data
public class QiyuesuoContract {
    private Integer id;
    private String contractNo;
    private Long categoryId;
    private String contractName;
    private String signName;
    private Integer signStatus;
    private Timestamp signTime;
    private Timestamp starTime;
    private Timestamp endTime;
    private Long contractId;
    private Timestamp sendTime;
    private Integer sendStatus;
    private String sendParam;
    private String contractResult;
    private String senderMobile;
    private String contractUrl;
}
