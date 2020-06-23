
package com.connect2.ec.adapter.ec.am.fulfillmentinventory.model;

import java.sql.Date;
import java.util.List;

import com.connect2.ec.adapter.ec.am.client.MwsResponseHeaderMetadata;

/*******************************************************************************
 * Copyright 2009-2016 Amazon Services. All Rights Reserved.

import java.util.List;

import com.connect2.ec.adapter.ec.am.client.*;

import java.util.Date;

/**
 * ResponseHeaderMetadata
 */
public class ResponseHeaderMetadata extends MwsResponseHeaderMetadata {

    /** Value constructor. */
    public ResponseHeaderMetadata(String requestId, List<String> responseContext, String timestamp,
                                  Double quotaMax, Double quotaRemaining, Date quotaResetsAt) {
        super(requestId, responseContext, timestamp, quotaMax, quotaRemaining, quotaResetsAt);
    }

    /** Empty constructor. */
    public ResponseHeaderMetadata() {
        super(null, null, null, null, null, null);
    }

    /** Copy constructor. */
    public ResponseHeaderMetadata(MwsResponseHeaderMetadata rhmd) {
        super(rhmd);
    }

}
