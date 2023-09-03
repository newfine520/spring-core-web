package com.itqf.spring.vo.request;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@ApiModel(value = "人员导入信息",description = "人员导入信息")
public class UserRequest {
    private Integer id;
    private String agentName;
    private String password;
    @ApiModelProperty(value="员工编号")
    @Excel(name="员工编号",orderNum="1")
    private String userNo;
    @ApiModelProperty(value = "姓名")
    @Excel(name="姓名",orderNum="2")
    private String userName;
    @ApiModelProperty(value = "职位")
    @Excel(name="职位",orderNum="3")
    private String positionId;
    @ApiModelProperty(value = "上级工号")
    @Excel(name="上级工号",orderNum="4")
    private String parentId;
    @ApiModelProperty(value = "上级姓名")
    @Excel(name="上级姓名",orderNum="5")
    private String parentName;
    @ApiModelProperty(value = "手机号")
    @Excel(name="手机号",orderNum="6")
    private String mobile;
    @ApiModelProperty(value = "邮箱")
    @Excel(name="邮箱",orderNum="7")
    private String email;
    @ApiModelProperty(value = "在职状态")
    @Excel(name="在职状态",orderNum="8")
    private String serviceStatusCode;
    @ApiModelProperty(value = "身份证")
    @Excel(name="身份证",orderNum="9")
    private String idCard;
    @ApiModelProperty(value = "性别")
    @Excel(name="性别",orderNum="10")
    private String sexCode;
    @ApiModelProperty(value = "入职日期")
    @Excel(name="入职日期",orderNum="11")
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd")
    private Date entryDate;
    @ApiModelProperty(value = "奥维思入职日期")
    @Excel(name="奥维思入职日期",orderNum="12")
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd")
    private Date owsEntryDate;
    @ApiModelProperty(value = "离职日期")
    @Excel(name="离职日期",orderNum="13")
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd")
    private Date leaveDate;
    @ApiModelProperty(value = "职级")
    @Excel(name="职级",orderNum="14")
    private String positionTypeCode;
    @ApiModelProperty(value = "家庭地址")
    @Excel(name="家庭地址",orderNum="15")
    private String address;
    @ApiModelProperty(value = "户籍地址")
    @Excel(name="户籍地址",orderNum="16")
    private String registerAddress;
    @ApiModelProperty(value = "备注")
    @Excel(name="备注",orderNum="17")
    private String remark;
    @ApiModelProperty(value = "大区")
    @Excel(name="大区",orderNum="18")
    private String areaId;
    @ApiModelProperty(value = "小区")
    @Excel(name="小区",orderNum="19")
    private String subAreaId;
    @ApiModelProperty(value = "省份")
    @Excel(name="省份",orderNum="20")
    private String provinceId;
    @ApiModelProperty(value = "城市")
    @Excel(name="城市",orderNum="17")
    private String roleName;
    private String roleId;
    private String cityId;
    private Integer page;
    private Integer limit;
    private Long count;
    private List<Integer> userIds;
    private String contractTemplateId;
    private String contractTemplateName;
    private Integer contractTemplateEnum;
    private String contractType;
}
