package com.itqf.spring.entity;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class WebMenu {
   private String moduleName;
   private String urlName;
   private String urlSort;
   private String modSort;
   private String url;
}
