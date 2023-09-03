package com.itqf.spring.entity;

import lombok.Data;

@Data
public class Position {
    private Integer id;
    private String positionName;
    private String remark;
    private Integer isDelete;
    private Integer roleId;
}
