package com.itqf.spring.vo.response;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

@ApiModel("响应报文体的包装")
public class MyResponseEntity<T> implements Serializable {
    private static final long serialVersionUID = 1L;
    public static final int SUCCESS = 0;
    public static final int FAILURE = -1;

    @ApiModelProperty(required = true, value = "操作结果，成功0、失败-1")
    private int code;
    @ApiModelProperty(required = false, value = "当失败时返回的信息")
    private String msg;
    @ApiModelProperty(required = false, value = "响应的业务数据")
    private T data;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public static <T> MyResponseEntity<T> success() {
        MyResponseEntity<T> entity = new MyResponseEntity<>();
        entity.setCode(SUCCESS);
        return entity;
    }

    public static <T> MyResponseEntity<T> success(T data) {
        MyResponseEntity<T> entity = success();
        entity.setData(data);
        return entity;
    }

    public static <T> MyResponseEntity<T> error(String message) {
        MyResponseEntity<T> entity = new MyResponseEntity<>();
        entity.setCode(FAILURE);
        entity.setMsg(message);
        return entity;
    }
}
