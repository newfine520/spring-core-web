package com.itqf.spring.enums;

public enum LeaveReasonEnum {
    Carrior("Carrior","职业规划与目前发展不符"),
    Salary("Salary","工资低"),
    GoHome("GoHome","回老家");
    private String code;

    private String name;

    LeaveReasonEnum(String code, String name) {
        this.code = code;
        this.name = name;
    }


    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
