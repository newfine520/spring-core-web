package com.itqf.spring.entity;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Role {
   private Integer id;
   private String nameZh;
   private String nameEn;
   private String sysName;
   private String remark;
   private Integer isDelete;
   private  String roleCode;
   private Integer isFrozen;
}
