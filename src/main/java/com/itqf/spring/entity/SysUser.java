package com.itqf.spring.entity;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class SysUser {
   private Integer id;
   private String userName;
   private String password;
   private String departmentId;
   private String mobile;
   private String serviceStatusCode;
   private String idCard;
   private String loginStatusCode;
   private String sexCode;
   private Timestamp entryDate;
   private String rank;
   private String address;
   private String roleCode;
   private String dispatch_TypeCode;
   private String sysItems;
   private String parentId;
   private String remark;
   private Integer isDeleted;
   private String createBy;
   private Timestamp createTime;
   private String positionTypeCode;
   private String userNo;
   private Timestamp leaveDate;
   private Timestamp lastUpdateTime;
   private String lastUpdateBy;
   private String provinceId;
   private String cityId;
   private String districtId;
   private Timestamp entryDateUc;
   private Timestamp leaveDatePropose;
   private String checkNo;
   private String birthDate;
   private String workArea;
   private String email;
   private String replaceId;
   private String areaId;
   private String subAreaId;
   private String positionId;
   private String registerAddress;
   private Timestamp owsEntryDate;
   private String parentName;
}
