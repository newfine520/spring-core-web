package com.itqf.spring.mapper;

import com.itqf.spring.entity.QiyuesuoTemplate;
import com.itqf.spring.vo.request.QiyuesuoContractRequest;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface QiyuesuoContractMapper {
    List<QiyuesuoTemplate> queryQiyuesuoContractTemplate();
    int saveQiyuesuoContract(@Param("qr") QiyuesuoContractRequest qr);
    int modifyQiyuesuoContract(@Param("qr") QiyuesuoContractRequest qr);
}
