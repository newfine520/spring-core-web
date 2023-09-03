package com.itqf.spring.consts;

import java.net.PortUnreachableException;

public enum PositionStatus {
    待入职(3000050),
    在职(3000010),
    离职(3000020),
    待离职(3000030);
    private final int value;
    PositionStatus(int value)
    {
        this.value=value;
    }
    public  int getValue()
    {
        return  value;
    }
}
