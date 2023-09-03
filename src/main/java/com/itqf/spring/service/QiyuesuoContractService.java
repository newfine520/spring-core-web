package com.itqf.spring.service;

import com.itqf.spring.vo.request.ContractSendRequest;
import com.itqf.spring.vo.request.QiyuesuoContractRequest;
import com.itqf.spring.vo.response.ContractSendResponse;
import com.itqf.spring.vo.response.QiyuesuoContractResponse;

import java.util.List;

public interface QiyuesuoContractService {
    List<QiyuesuoContractResponse> queryQiyuesuoContractTemplate();
    void saveOrUpdate(QiyuesuoContractRequest qiyuesuoContractRequest);
    ContractSendResponse sendContract(String url,ContractSendRequest contractSendRequest);
}
