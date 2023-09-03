package com.itqf.spring.logging.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VisitInfoInterceptor extends HandlerInterceptorAdapter {
    private static final Logger logger= LoggerFactory.getLogger(VisitInfoInterceptor.class);

    @Override
//在请求发生前执行
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        logger.debug("接收到一个新的请求，开始记录用户的操作痕迹");
        String url = request.getRequestURL().toString();
        String userAgent = request.getHeader("User-Agent");
        String authorization = request.getHeader("Authorization");
        return true;
    }
    //在请求完成后执行
    public  void postHandler(HttpServletRequest request,HttpServletResponse response,Object handler,ModelAndView modelAndView)
    {
     long startTime=(Long) request.getAttribute("startTime");
     request.removeAttribute("startTime");
     long endTime= System.currentTimeMillis();
     System.out.println("本次请求处理时间为："+new Long(endTime-startTime)+"ms");
     request.setAttribute("handingTime",endTime-startTime);
    }
    }
