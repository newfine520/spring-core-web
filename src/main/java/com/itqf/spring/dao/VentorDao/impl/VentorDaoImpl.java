package com.itqf.spring.dao.VentorDao.impl;
import com.itqf.spring.dao.VentorDao.iVentorDao;
import org.springframework.stereotype.Repository;

@Repository("ventorDaoImpl")
public class VentorDaoImpl implements iVentorDao {
    public VentorDaoImpl() {
        System.out.println("------------> VentorDaoImpl");
    }
}
