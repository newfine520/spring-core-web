package com.itqf.spring.enums;

public enum SignStatusEnum {
    Daiqianyue(0,"待签约"),
    Qianshuwancheng(1,"签署完成"),
    Qianyueshibai(2,"签约失败"),
    Yijieshu(3,"已结束"),
    Tiqianzhongzhi(4,"提前终止"),
    Yuqiweiqian(5,"逾期未签"),
    Yichehui(6,"已撤回"),
    Zuofeidaiqianshu(7,"作废待签署"),
    Yizuofei(8,"已作废");

    private int code;

    private String name;

    SignStatusEnum(int code, String name) {
        this.code = code;
        this.name = name;
    }


    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
