package com.itqf.spring.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.itqf.spring.entity.QiyuesuoTemplate;
import com.itqf.spring.mapper.QiyuesuoContractMapper;
import com.itqf.spring.service.QiyuesuoContractService;
import com.itqf.spring.vo.request.ContractSendRequest;
import com.itqf.spring.vo.request.QiyuesuoContractRequest;
import com.itqf.spring.vo.response.ContractSendResponse;
import com.itqf.spring.vo.response.QiyuesuoContractResponse;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
@Slf4j
@Service("qiyuesuoContractServiceImpl")
public class QiyuesuoContractServiceImpl implements QiyuesuoContractService {
    //20211128如果引用第三方jar包，肯定是不能直接使用常用注解@Controller、@Service、@Repository、@Component将类的实例注入到spring容器中。需要在spring的xml文件中配置需要导入的bean
    @Autowired
    private OkHttpClient okHttpClient;

    @Autowired
    private QiyuesuoContractMapper qiyuesuoContractMapper;
    public List<QiyuesuoContractResponse> queryQiyuesuoContractTemplate(){
           List<QiyuesuoTemplate> qiyuesuoContractList=qiyuesuoContractMapper.queryQiyuesuoContractTemplate();
           if(CollectionUtils.isEmpty(qiyuesuoContractList))
           {
               return Lists.newArrayList();
           }
        List<QiyuesuoContractResponse> list = qiyuesuoContractList.stream().map(a -> {
            QiyuesuoContractResponse response = new QiyuesuoContractResponse();
            BeanUtils.copyProperties(a, response);
            return response;
        }).collect(Collectors.toList());
        return list;
    }
    @Override
    public void saveOrUpdate(QiyuesuoContractRequest qiyuesuoContractRequest)
    {
      if(Objects.nonNull(qiyuesuoContractRequest))
      {
          //新增
          if(qiyuesuoContractRequest.getId()==null) {
              qiyuesuoContractMapper.saveQiyuesuoContract(qiyuesuoContractRequest);
          }//更新 todo
          else
          {
              qiyuesuoContractMapper.modifyQiyuesuoContract(qiyuesuoContractRequest);
          }
      }

    }
    @Override
   public ContractSendResponse sendContract(String url,ContractSendRequest contractSendRequest)
    {
        ContractSendResponse jsonResult=new ContractSendResponse();
         String jsonString = JSON.toJSONString(contractSendRequest);
         log.info("contract param is:{}",jsonString);
                    RequestBody requestBody= FormBody.create(MediaType.parse("application/json; charset=utf-8")
                            , jsonString);
                    Request request=new Request.Builder()
                            .url(url)
                            .post(requestBody)
                            .build();
                    Call call=okHttpClient.newCall(request);
        try
        {
            Response response = call.execute();
            String resultBody = response.body().string();
            log.info("contract result is:{}",resultBody);
            jsonResult = JSON.parseObject(resultBody,ContractSendResponse.class);
        }
        catch (Exception e)
        {

        }
        return jsonResult;
    }
}
