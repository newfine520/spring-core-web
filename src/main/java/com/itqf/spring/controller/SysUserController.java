package com.itqf.spring.controller;
import com.alibaba.fastjson.JSONObject;
import com.itqf.spring.bean.BeanTest;
import com.itqf.spring.entity.SysUser;
import com.itqf.spring.entity.User;
import com.itqf.spring.enums.SignStatusEnum;
import com.itqf.spring.service.*;
import com.itqf.spring.utils.CommonHelper;
import com.itqf.spring.utils.KeyValue;
import com.itqf.spring.utils.excel.EasyPoiExcelUtil;
import com.itqf.spring.vo.request.ContractInfoRequest;
import com.itqf.spring.vo.request.QiyuesuoContractRequest;
import com.itqf.spring.vo.request.UserRequest;
import com.itqf.spring.vo.response.ContractUserResponse;
import com.itqf.spring.vo.response.MyResponseEntity;
import com.itqf.spring.vo.response.MyResponseForPage;
//import org.apache.log4j.LogManager;
//import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@RestController
public class SysUserController {
    //private static  final Logger logger= LogManager.getLogger(SysUserController.class);
    @Autowired
    public IUserService userService;
    @Autowired
    public IRoleService roleService;
    @Autowired
    public IPositionService positionService;
    @Autowired
    public QiyuesuoContractService qiyuesuoContractService;
    @Autowired
    private AlertService alertService;

    @GetMapping("/home")
    public String home(){
        return "home";
    }
    @GetMapping("/hello")
    //20211113麻辣隔壁，不加这个注解，此方法无法访问，找问题找了一晚上
    @ResponseBody
    public String Hello()
    {

        //logger.error("haha");
        return "hello";
    }
//    @PostMapping("/index")
//    @ResponseBody
//    public String index(UserRequest userRequest){
//        userRequest.setAgentName("admin");
//        userRequest.setPassword("e00cf25ad42683b3df678c61f42c6bda");
//        List<UserBean> userBeanList=userMapper.queryByUserName(userRequest.getAgentName(),userRequest.getPassword());
//        if(userBeanList.size()>0)  return "index";
//        return "failure";
//    }

    @GetMapping("/index")
    public String index(Model model){
        model.addAttribute("currentUser",userService.getUserInfoByUsername(""));
        return "index";
    }
    @GetMapping("/failure")
    public String failure(){
        return "failure";
    }

    @GetMapping("/syslogin")
    public String syslogin(){
        return "syslogin";
    }

    @GetMapping("/userindex")
    public String userindex(Model model)
    {
        model.addAttribute("roleList",roleService.queryRole());
        model.addAttribute("positionList",positionService.queryPosition());
        model.addAttribute("contractTemplateList",qiyuesuoContractService.queryQiyuesuoContractTemplate());
        return "userindex";
    }
    @RequestMapping("/upload")
    @ResponseBody
    public MyResponseEntity upload(@RequestParam("file") CommonsMultipartFile file, HttpServletRequest request) throws IOException {
        return userService.upload(file,request);
    }
    @GetMapping("/sysUserList")
    @ResponseBody
    public MyResponseForPage sysUserList(UserRequest userRequest)
    {
        return userService.sysUserList(userRequest);
    }
    @PostMapping(value = "/exportUserList")
    @ResponseBody
    public void exportEmployeeSalaryBaseInfo(UserRequest userRequest, HttpServletResponse response) {
        List<UserRequest> hrEmployeeSalaryInfoBseInfoVOList = userService.userRequestList(userRequest);
        EasyPoiExcelUtil.exportExcel(hrEmployeeSalaryInfoBseInfoVOList, "人员管理", "sheet1", UserRequest.class, "人员管理.xls", response);
    }
    @PostMapping("/sendContract")
    @ResponseBody
    public MyResponseEntity  sendContract(UserRequest userRequest)
    {
        List<ContractUserResponse> sysUserList=userService.contractUserList(userRequest);
        ContractInfoRequest contractInfoRequest=new ContractInfoRequest();
        sysUserList.forEach(sysUser->{
            Properties properties=CommonHelper.getApiModelProperty("com.itqf.spring.vo.response.ContractUserResponse");
            try {
                List<KeyValue> templateParam=new ArrayList<>();
                Field[] currentObjectfields=sysUser.getClass().getDeclaredFields();
                for(Field field:currentObjectfields)
                {
                    field.setAccessible(true);
                    KeyValue keyValue=new KeyValue();
                    keyValue.setName(properties.getProperty(field.getName()));
                    keyValue.setValue(field.get(sysUser).toString());
                    templateParam.add(keyValue);
                }
                contractInfoRequest.setTemplateParam(templateParam);
                contractInfoRequest.setContractTemplateId(userRequest.getContractTemplateId());
                contractInfoRequest.setContractTemplateName(userRequest.getContractTemplateName());
                contractInfoRequest.setContractTemplateEnum(userRequest.getContractTemplateEnum());
                contractInfoRequest.setContractType(userRequest.getContractType());
                contractInfoRequest.setSignerName(sysUser.getStaffName());
                //20211128联系方式 todo
                contractInfoRequest.setSignerContact(sysUser.getMobile());
                contractInfoRequest.setIsNeedCompanySign(0);//离职：0  入职/续约：1
                QiyuesuoContractRequest qiyuesuoContractRequest=new QiyuesuoContractRequest();
                qiyuesuoContractRequest.setContractName(userRequest.getContractTemplateId());
                qiyuesuoContractRequest.setSignName(sysUser.getStaffName());
                qiyuesuoContractRequest.setSignStatus(SignStatusEnum.Daiqianyue.getCode());
                Timestamp d = new Timestamp(System.currentTimeMillis());//java获取取得Timestamp类型的当前系统时间 格式：2010-11-04 16:19:42
                qiyuesuoContractRequest.setSignTime(d);
                qiyuesuoContractRequest.setStartTime(sysUser.getStartTime());
                qiyuesuoContractRequest.setEndTime(sysUser.getLeaveDate());
                qiyuesuoContractRequest.setSendTime(d);
                qiyuesuoContractRequest.setSendStatus(0);
                qiyuesuoContractRequest.setSenderMobile(sysUser.getMobile());
                qiyuesuoContractRequest.setSendParam(JSONObject.toJSONString(contractInfoRequest));
                qiyuesuoContractService.saveOrUpdate(qiyuesuoContractRequest);
                //发送到rabbitmq消息队列
                alertService.sendContractInfoAlert(contractInfoRequest);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        });
        return MyResponseEntity.success();
    }
}
