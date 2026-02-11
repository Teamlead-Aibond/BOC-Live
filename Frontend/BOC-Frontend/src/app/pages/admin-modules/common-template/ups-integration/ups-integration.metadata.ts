//Testing: https://wwwcie.ups.com/track/v1/details/{inquiryNumber}
//Production: https://onlinetools.ups.com/track/v1/details/{inquiryNumber}

//Method: GET
//--- Request header ----
//AccessLicenseNumber : 0D90D48B4B528035
//Content-Type : application/json
//inquiryNumber : 1Z5338FF0107231059 - test no
//transactionSrc : RRNo / RRId

export interface Tracking {
    trackResponse: {
        shipment: [
            {
                package: [
                    {
                        trackingNumber: string;
                        deliveryDate: [
                            {
                                //RDD – Rescheduled Delivery Date
                                //SDD – Scheduled Delivery Date
                                //DEL – Delivery Date
                                type: string;
                                //Format: MMDDYYYY
                                date: string;
                            }
                        ],
                        deliveryTime:
                        {
                            //Format: HHMMSS – 24 hours
                            startTime: string;
                            //Format: HHMMSS – 24 hours
                            endTime: string;
                            //DEL Delivery Time
                            //CDW Confirm Delivery Window
                            //IDW Imminent Delivery Window
                            //EDW Estimated Delivery Window
                            //CMT Commit Time
                            //EOD End of Day
                            type: string;
                        },
                        activity: [
                            {
                                location: {
                                    address: {
                                        city: string;
                                        stateProvince: string;
                                        postalCode: string;
                                        country: string;
                                        //countryCode: string;
                                    }
                                },
                                status: {
                                    //D Delivered
                                    //I In Transit
                                    //M Billing Information Received
                                    //MV Billing Information Voided
                                    //P Pickup
                                    //X Exception
                                    //RS Returned to Shipper
                                    //DO Delivered Origin CFS (Freight Only)
                                    //DD Delivered Destination CFS (Freight Only)
                                    //W Warehousing (Freight Only)
                                    //NA Not Available
                                    //O Out for Delivery
                                    type: string;
                                    description: string;
                                    code: string;
                                },
                                //Format: YYYYMMDD
                                date: string;
                                //Format: HHMMSS (24 hr)
                                time: string;
                            }
                        ]
                    }
                ]
            }
        ]
    }

    //static data
    trackResponse1:[
        {
            "TrackingNumber": [
                "1Z12345E0291980793"
            ],
            "EstimatedDeliveryWindow": [
                {
                    "Date": [
                        "04242019"
                    ],
                    "StartTime": [
                        "101520"
                    ],
                    "EndTime": [
                        "151520"
                    ]
                }
            ],
            "Activity": [
                {
                    "ActivityLocation": [
                        {
                            "Address": [
                                {
                                    "City": [
                                        "ANYTOWN"
                                    ],
                                    "StateProvinceCode": [
                                        "GA"
                                    ],
                                    "PostalCode": [
                                        "30340"
                                    ],
                                    "CountryCode": [
                                        "US"
                                    ]
                                }
                            ],
                            "Code": [
                                "ML"
                            ],
                            "Description": [
                                "BACK DOOR"
                            ],
                            "SignedForByName": [
                                "HELEN SMITH"
                            ]
                        }
                    ],
                    "Status": [
                        {
                            "StatusType": [
                                {
                                    "Code": [
                                        "D"
                                    ],
                                    "Description": [
                                        "DELIVERED"
                                    ]
                                }
                            ],
                            "StatusCode": [
                                {
                                    "Code": [
                                        "KM"
                                    ]
                                }
                            ]
                        }
                    ],
                    "Date": [
                        "20100610"
                    ],
                    "Time": [
                        "120000"
                    ],
                    "GMTDate": [
                        "2019-04-15"
                    ],
                    "GMTTime": [
                        "15.40.17"
                    ],
                    "GMTOffset": [
                        "-04.00"
                    ]
                },
                {
                    "ActivityLocation": [
                        {
                            "Address": [
                                {
                                    "CountryCode": [
                                        "US"
                                    ]
                                }
                            ]
                        }
                    ],
                    "Status": [
                        {
                            "StatusType": [
                                {
                                    "Code": [
                                        "M"
                                    ],
                                    "Description": [
                                        "BILLING INFORMATION RECEIVED. SHIPMENT DATE PENDING."
                                    ]
                                }
                            ],
                            "StatusCode": [
                                {
                                    "Code": [
                                        "MP"
                                    ]
                                }
                            ]
                        }
                    ],
                    "Date": [
                        "20100608"
                    ],
                    "Time": [
                        "120000"
                    ],
                    "GMTDate": [
                        "2019-04-15"
                    ],
                    "GMTTime": [
                        "15.40.17"
                    ],
                    "GMTOffset": [
                        "-04.00"
                    ]
                }
            ],
            "PackageWeight": [
                {
                    "UnitOfMeasurement": [
                        {
                            "Code": [
                                "LBS"
                            ]
                        }
                    ],
                    "Weight": [
                        "5.00"
                    ]
                }
            ],
            "ReferenceNumber": [
                {
                    "Code": [
                        "01"
                    ],
                    "Value": [
                        "LINE4AND115"
                    ]
                },
                {
                    "Code": [
                        "08"
                    ],
                    "Value": [
                        "LJ67Y5"
                    ]
                }
            ]
        }
    ]
}
