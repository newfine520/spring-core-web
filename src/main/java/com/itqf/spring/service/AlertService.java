package com.itqf.spring.service;

import com.itqf.spring.vo.request.ContractInfoRequest;
import com.itqf.spring.vo.request.UserRequest;

public interface AlertService {
    void sendContractInfoAlert(ContractInfoRequest contractInfoRequest);
    String receive();
}
