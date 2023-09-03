package com.itqf.spring.vo.response;

import com.itqf.spring.vo.request.UserRequest;
import lombok.Data;

import java.util.List;

@Data
public class MyResponseForPage {
    public List<UserRequest> rows;
    public Integer page;
    public Integer limit;
    public Long total;
}
