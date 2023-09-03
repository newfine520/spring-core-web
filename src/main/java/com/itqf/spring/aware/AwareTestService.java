package com.itqf.spring.aware;

import org.springframework.context.*;

public interface AwareTestService extends EnvironmentAware, EmbeddedValueResolverAware, ResourceLoaderAware, ApplicationEventPublisherAware, MessageSourceAware,ApplicationContextAware {
    void test();
}
