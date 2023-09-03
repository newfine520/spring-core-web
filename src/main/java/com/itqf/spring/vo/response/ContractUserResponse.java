package com.itqf.spring.vo.response;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.sql.Timestamp;
import java.util.Date;

@Data
public class ContractUserResponse {
    @ApiModelProperty(value = "员工姓名")
    private String staffName;
    @ApiModelProperty(value = "员工姓名2")
    private String staffName2;
    @ApiModelProperty(value = "员工岗位")
    private String positionName;
    //20211127Date->Timestamp todo
    @ApiModelProperty(value = "入职日期")
    private Timestamp startTime;
    @ApiModelProperty(value = "离职日期")
    private Timestamp LeaveDate;
    @ApiModelProperty(value = "离职日期2")
    private Date LeaveDate2;
    @ApiModelProperty(value = "离职日期3")
    private Date LeaveDate3;
    @ApiModelProperty(value = "离职日期4")
    private Date leaveDate4;
    @ApiModelProperty(value = "直接上级")
    private String directorSuperior;
    @ApiModelProperty(value = "直接上级2")
    private String directorSuperior2;
    @ApiModelProperty(value = "上级主管")
    private String supervisor;
    @ApiModelProperty(value = "上级主管2")
    private String supervisor2;
    @ApiModelProperty(value = "上级主管3")
    private String supervisor3;
    @ApiModelProperty(value = "OA")
    private String OA;
    @ApiModelProperty(value = "OA2")
    private String OA2;
    @ApiModelProperty(value = "离职原因")
    private String reason;
    @ApiModelProperty(value="联系方式")
    private String mobile;
}
