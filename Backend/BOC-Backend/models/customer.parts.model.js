/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
// const { request } = require("../app.js");
const Customers = require("../models/customers.model.js");
var async = require('async');
const Part = require("../models/parts.model.js");
const Parts = require("../models/parts.model.js");

const CustomerPartsModel = function (objParts) {
    this.CustomerPartId = objParts.CustomerPartId;
    this.PartId = objParts.PartId;
    this.CustomerId = objParts.CustomerId;
    this.NewPrice = objParts.NewPrice ? objParts.NewPrice : 0;
    this.LastPricePaid = objParts.LastPricePaid ? objParts.LastPricePaid : 0;
    this.CustomerPartNo1 = objParts.CustomerPartNo1 ? objParts.CustomerPartNo1 : '';
    this.CustomerPartNo2 = objParts.CustomerPartNo2 ? objParts.CustomerPartNo2 : '';
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();

    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objParts.authuser && objParts.authuser.UserId) ? objParts.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objParts.authuser && objParts.authuser.UserId) ? objParts.authuser.UserId : TokenUserId;

    this.LocalCurrencyCode = objParts.LocalCurrencyCode ? objParts.LocalCurrencyCode : '';
    this.ExchangeRate = objParts.ExchangeRate ? objParts.ExchangeRate : 1;
    this.BaseCurrencyCode = objParts.BaseCurrencyCode ? objParts.BaseCurrencyCode : '';
    this.BaseNewPrice = objParts.BaseNewPrice ? objParts.BaseNewPrice : 0;

    // For Server Side Search 
    this.start = objParts.start;
    this.length = objParts.length;
    this.search = objParts.search;
    this.draw = objParts.draw;
};
const CustomerPartModelImport = function FunctionName(obj) {

    this.CustomerName = obj["Customer"] ? obj["Customer"].trim() : '';
    this.PartNo = obj["PartNo"] ? obj["PartNo"] : '';
    this.Description = obj["Description"] ? obj["Description"].replace("'", "\\'").trim() : '';
    this.CustomerPartNo1 = obj["Customer part - 1"] ? obj["Customer part - 1"] : '';
    this.CustomerPartNo2 = obj["Customer part - 2"] ? obj["Customer part - 2"] : '';
    this.NewPrice = obj["Price Of New"] ? obj["Price Of New"] : 0;
};

CustomerPartsModel.Import = (Model, result) => {
    var Obj = new CustomerPartModelImport(Model);
    var sqlCustomer = Customers.GetCustomerIdFromCustomerName(Obj.CustomerName);
    // var IsExistCustomerPart = CustomerPartsModel.IsExistCustomerPart(Obj.PartNo, Obj.CustomerName);
    async.parallel([
        function (result) { con.query(sqlCustomer, result); },
        function (result) { Part.GetPartByPartNo(Obj.PartNo, result); },
        // function (result) { con.query(IsExistCustomerPart, result); },
    ],
        function (err, results) {
            if (err) {
                result(err, null)
            } else {
                if (results[0][0].length == 0) {
                    result({ msg: "Customer Not Available" }, null);
                }
                else if (results[1].length == 0) {
                    result({ msg: "Part Not Available : " + Obj.PartNo + "" }, null)
                }
                else {
                    if (results[0][0].length > 0 && results[1].length > 0) {
                        var CustomerId = results[0][0][0].CustomerId > 0 ? results[0][0][0].CustomerId : 0;
                        var PartId = results[1][0].PartId > 0 ? results[1][0].PartId : 0;
                        // var IsExistCustomerPartId = (results[2][0].length > 0 && results[2][0][0].CustomerPartId > 0) ? true : false;
                        var IsExistCustomerPartId = false;

                        const CustomerPart = {
                            CustomerId: CustomerId,
                            PartId: PartId,
                            CustomerPartNo1: Obj.CustomerPartNo1,
                            CustomerPartNo2: Obj.CustomerPartNo2,
                            NewPrice: Obj.NewPrice,
                            LocalCurrencyCode: Obj.LocalCurrencyCode ? Obj.LocalCurrencyCode : '',
                            ExchangeRate: Obj.ExchangeRate ? Obj.ExchangeRate : 1,
                            BaseCurrencyCode: Obj.BaseCurrencyCode ? Obj.BaseCurrencyCode : '',
                            BaseNewPrice: Obj.BaseNewPrice ? Obj.BaseNewPrice : 0

                        };

                        const PartObj = {
                            PartId: PartId,
                            Description: Obj.Description
                        };
                        async.parallel([
                            function (result) {
                                if (IsExistCustomerPartId) { CustomerPartsModel.UpdateCustomerPartNos(new CustomerPartsModel(CustomerPart), result); }
                                else { CustomerPartsModel.create(CustomerPart, result); }
                            },
                            /* function (result) {
                                 if (PartObj.Description != "") { Part.UpdateDescription(new Part(PartObj), result); } else { return (null, null); }
                             },*/
                        ],
                            function (err, results) {
                                if (err) {
                                    result(err, null)
                                } else {
                                    var Status = IsExistCustomerPartId == true ? "Record Updated" : "Record Inserted";
                                    result(null, { msg: Status, PartNo: Obj.PartNo })
                                }
                            });
                    }
                    else {
                        result({ msg: "No Response" }, null)
                    }
                }
            }
        });
};

CustomerPartsModel.UpdateCustomerPartNos = (Obj, result) => {
    var Query = `Update tbl_customer_parts set  ModifiedBy='${Obj.ModifiedBy}',Modified='${Obj.Modified}', `;
    // if (Obj.NewPrice > 0)
    // Query += ` NewPrice=${Obj.NewPrice},`;
    // if (Obj.CustomerPartNo1 != "")
    Query += ` CustomerPartNo1='${Obj.CustomerPartNo1}',`;
    //if (Obj.CustomerPartNo2 != "")
    Query += ` CustomerPartNo2='${Obj.CustomerPartNo2}',`;

    Query = Query.slice(0, -1);
    Query += `  WHERE CustomerId=${Obj.CustomerId} AND PartId=${Obj.PartId} `;
    con.query(Query, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

CustomerPartsModel.IsExistCustomerPart = (PartNo, CompanyName, result) => {
    return `Select PartId,CustomerPartId from tbl_customer_parts WHERE IsDeleted = 0 
     AND  PartId=(Select PartId From tbl_parts where IsDeleted=0 and PartNo='${PartNo}' limit 1)
     AND  CustomerId=(Select CustomerId From tbl_customers where IsDeleted=0 and CompanyName='${CompanyName}' limit 1)`;

}

//To create a customer parts
CustomerPartsModel.create = (ReqBody, result) => {
    var Obj = new CustomerPartsModel(ReqBody);
    con.query(`Select PartId,CustomerPartId from tbl_customer_parts WHERE IsDeleted = 0  AND  PartId= ${Obj.PartId} AND  CustomerId= ${Obj.CustomerId}`, (err, resCheck) => {
        if (err) {
            result(err, null);
            return;
        }
        if (resCheck.length > 0) {
            // result({ msg: "Part already linked with customer." }, null);
            Obj.CustomerPartId = resCheck[0].CustomerPartId > 0 ? resCheck[0].CustomerPartId : 0;
            /* var sql = `UPDATE tbl_customer_parts SET NewPrice=?,LastPricePaid=?,Modified=?,ModifiedBy=?,CustomerPartNo1=?,CustomerPartNo2=? WHERE CustomerPartId = ? `
             var values = [
                 Obj.NewPrice, Obj.LastPricePaid, Obj.Modified, Obj.ModifiedBy, Obj.CustomerPartNo1, Obj.CustomerPartNo2, Obj.CustomerPartId
             ]*/
            var sql = `UPDATE tbl_customer_parts SET Modified=?,ModifiedBy=?,CustomerPartNo1=?,CustomerPartNo2=?,NewPrice=?,BaseNewPrice=? WHERE CustomerPartId = ? `
            var values = [
                Obj.Modified, Obj.ModifiedBy, Obj.CustomerPartNo1, Obj.CustomerPartNo2, Obj.NewPrice, Obj.BaseNewPrice, Obj.CustomerPartId
            ]

            con.query(sql, values, function (err, res) {
                if (err) {
                    console.log(err.sql)
                    return result(err, null);
                }
                var Type = "customer"
                Parts.GetPartsByPartId(Obj.PartId, Obj.CustomerId, Type, (errGP, dataGP) => {
                    result(null, dataGP[0]);
                });
                // result(null, { id: Obj.CustomerPartId, ...Obj });
            });

        } else {
            var sql = `insert into tbl_customer_parts(PartId,CustomerId,NewPrice,LastPricePaid,Created,CreatedBy,CustomerPartNo1,CustomerPartNo2,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseNewPrice)
             values ('${Obj.PartId}','${Obj.CustomerId}','${Obj.NewPrice}','${Obj.LastPricePaid}','${Obj.Created}','${Obj.CreatedBy}','${Obj.CustomerPartNo1}','${Obj.CustomerPartNo2}','${Obj.LocalCurrencyCode}','${Obj.ExchangeRate}','${Obj.BaseCurrencyCode}','${Obj.BaseNewPrice}')`;
            con.query(sql, (err, res) => {
                if (err)
                    return result(err, null);

                ReqBody.CustomerPartId = res.insertId;
                var Type = "customer"
                Parts.GetPartsByPartId(Obj.PartId, Obj.CustomerId, Type, (errGP, dataGP) => {
                    result(null, dataGP[0]);
                });
                // return result(null, { id: res.insertId, ...ReqBody });
            });
        }
    });
}

//To create a customer parts
CustomerPartsModel.createforRRImport = (ReqBody, result) => {
    var Obj = new CustomerPartsModel(ReqBody);
    con.query(`Select PartId,CustomerPartId from tbl_customer_parts WHERE IsDeleted = 0  AND  PartId= ${Obj.PartId} AND  CustomerId= ${Obj.CustomerId}`, (err, resCheck) => {
        if (err) {
            result(err, null);
            return;
        }
        if (resCheck.length > 0) {
            ReqBody.CustomerPartId = resCheck[0].CustomerPartId;
            return result(null, { id: resCheck[0].CustomerPartId, ...ReqBody });

        } else {
            var sql = `insert into tbl_customer_parts(PartId,CustomerId,NewPrice,LastPricePaid,Created,CreatedBy,CustomerPartNo1,CustomerPartNo2,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseNewPrice)
             values ('${Obj.PartId}','${Obj.CustomerId}','${Obj.NewPrice}','${Obj.LastPricePaid}','${Obj.Created}','${Obj.CreatedBy}','${Obj.CustomerPartNo1}','${Obj.CustomerPartNo2}','${Obj.LocalCurrencyCode}','${Obj.ExchangeRate}','${Obj.BaseCurrencyCode}','${Obj.BaseNewPrice}')`;
            con.query(sql, (err, res) => {
                if (err)
                    return result(err, null);

                ReqBody.CustomerPartId = res.insertId;
                return result(null, { id: res.insertId, ...ReqBody });
            });
        }
    });
}

//TO get all the csutomer parts
CustomerPartsModel.getAll = (CustomerId, result) => {
    con.query(`Select CP.CustomerPartId,CP.PartId, CP.NewPrice,CP.LastPricePaid, P.PartNo,  Description ,P.Price as PartAHPrice,P.LastPricePaid as GlobalLastPricePaid,P. ManufacturerPartNo,
            V.VendorName as Manufacturer, V.VendorId as ManufacturerId,CP.LocalCurrencyCode,CP.ExchangeRate,CP.BaseCurrencyCode,CP.BaseNewPrice
            from tbl_customer_parts as CP
            LEFT JOIN  tbl_parts as P ON P.PartId = CP.PartId
            LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId 
            WHERE P.IsDeleted = 0 AND CP.IsDeleted = 0  AND CP.CustomerId= ${CustomerId}`, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

//To fetch the customer parts with filters (datatable)
CustomerPartsModel.CustomerPartsListByServerSide = (CustomerPartsModel, result) => {
    var query = "";
    var selectquery = `Select CP.CustomerId,CP.CustomerPartId,CP.PartId, CP.NewPrice,CP.LastPricePaid,CP.CustomerPartNo1,CP.CustomerPartNo2,CP.LocalCurrencyCode,CP.ExchangeRate,CP.BaseCurrencyCode,CP.BaseNewPrice,
    P.PartNo,   Description ,P.Price as PartAHPrice,
    P.LastPricePaid as GlobalLastPricePaid, P.ManufacturerPartNo,
    V.VendorName as Manufacturer, V.VendorId as ManufacturerId, CUR.CurrencySymbol `;
    recordfilterquery = `Select count(CP.CustomerId) as recordsFiltered `;
    query = query + ` from tbl_customer_parts as CP
    LEFT JOIN  tbl_parts as P ON P.PartId = CP.PartId
    LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId 
   LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = CP.LocalCurrencyCode AND CUR.IsDeleted = 0
    WHERE CP.IsDeleted = 0  AND CP.CustomerId= '${CustomerPartsModel.CustomerId}' `;
    if (CustomerPartsModel.search.value != '') {
        query = query + ` and ( P.PartNo LIKE '%${CustomerPartsModel.search.value}%'
        or CP.NewPrice LIKE '%${CustomerPartsModel.search.value}%' 
        or CP.LastPricePaid LIKE '%${CustomerPartsModel.search.value}%' 
    ) `;
    }
    var Countquery = recordfilterquery + query;
    if (CustomerPartsModel.start != "-1" && CustomerPartsModel.length != "-1") {
        query += " LIMIT " + CustomerPartsModel.start + "," + (CustomerPartsModel.length);
    }
    query = selectquery + query;
    var TotalCountQuery = `SELECT Count(CustomerId) as TotalCount 
        from tbl_customer_parts as CP
        LEFT JOIN  tbl_parts as P ON P.PartId = CP.PartId
        LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId 
        WHERE CP.IsDeleted = 0  AND CP.CustomerId= '${CustomerPartsModel.CustomerId}' `;
    // console.log("query=" + query);
    //console.log("Countquery=" + Countquery);
    //console.log("TotalCountQuery=" + TotalCountQuery);
    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);
            // if (results[0][0].length > 0) {
            return result(null, {
                data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                recordsTotal: results[2][0][0].TotalCount, draw: CustomerPartsModel.draw
            });
            // } else {
            //     return result({ msg: "No Records Found" }, null);
            // }
        }
    );
};

//To get the customer parts info
CustomerPartsModel.GetPartsInfo = (CustomerPartId, result) => {
    con.query(`Select CP.CustomerPartId,CP.PartId, CP.NewPrice,CP.LastPricePaid,CP.LocalCurrencyCode,CP.ExchangeRate,CP.BaseCurrencyCode,CP.BaseNewPrice,
     P.PartNo,   P.Description ,P.Price as PartAHPrice,
     P.LastPricePaid as GlobalLastPricePaid, P.ManufacturerPartNo,
    V.VendorName as Manufacturer, V.VendorId as ManufacturerId
    from tbl_customer_parts as CP
    LEFT JOIN  tbl_parts as P ON P.PartId = CP.PartId
    LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId 
    WHERE CP.IsDeleted = 0  AND CP.CustomerPartId= ${CustomerPartId}`, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);

    });
}

//To get the customer info
CustomerPartsModel.GetCustomerInfo = (reqbody, result) => {
    var CustomerId = reqbody.CustomerId;
    var sql = Customers.viewquery(CustomerId, reqbody);
    var sql_parts = `Select CP.CustomerPartId,CP.PartId, CP.NewPrice,CP.LastPricePaid,CP.LocalCurrencyCode,CP.ExchangeRate,CP.BaseCurrencyCode,CP.BaseNewPrice,
     P.PartNo,   P.Description ,P.Price as PartAHPrice,
     P.LastPricePaid as GlobalLastPricePaid,P.ManufacturerPartNo,
    V.VendorName as Manufacturer, V.VendorId as ManufacturerId,C.CustomerCurrencyCode,CUR.CurrencySymbol
    from tbl_customer_parts as CP
    LEFT JOIN  tbl_customers as C ON C.CustomerID = CP.CustomerId AND C.IsDeleted = 0 
    LEFT JOIN  tbl_parts as P ON P.PartId = CP.PartId
    LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId 
    LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = C.CustomerCurrencyCode AND CUR.IsDeleted = 0
    WHERE CP.IsDeleted = 0  AND CP.CustomerId= ${CustomerId}`;

    //console.log(sql);
    //console.log(sql_parts);
    async.parallel([
        function (result) { con.query(sql, result) },
        function (result) { con.query(sql_parts, result) }
    ],
        function (err, results) {
            if (err) {
                console.log(err);
                return result(err, null);
            }

            if (results[0][0].length > 0) {
                return result(null, { CustomerInfo: results[0][0], PartsInfo: results[1][0] });
            } else {
                return result({ msg: "Customer not found" }, null);
            }
        }
    );
}

//To update the customer parts
CustomerPartsModel.update = (ReqBody, result) => {
    var Obj = new CustomerPartsModel(ReqBody);
    if (Obj.CustomerPartId) {
        var Query = `Update  tbl_customer_parts set  PartId=?,CustomerPartNo1=?,CustomerPartNo2=?,NewPrice=?,LastPricePaid=?,Modified=?,ModifiedBy=?,LocalCurrencyCode=?,ExchangeRate=?,BaseCurrencyCode=?,BaseNewPrice=? where CustomerId=? and CustomerPartId=?`;
        var values = [Obj.PartId, Obj.CustomerPartNo1, Obj.CustomerPartNo2, Obj.NewPrice, Obj.LastPricePaid, Obj.Modified, Obj.ModifiedBy, Obj.LocalCurrencyCode, Obj.ExchangeRate, Obj.BaseCurrencyCode, Obj.BaseNewPrice, ReqBody.CustomerId, Obj.CustomerPartId];
        //  console.log("parts query" + Query, values);
        con.query(Query, values, (err, res1) => {
            if (err)
                return result(err, null);
            return result(null, ReqBody);
        });
    } else {
        return result({ msg: "Customer part id is required" }, null);
    }
};

//To update the parts list
CustomerPartsModel.updateList = (ReqBody, result) => {
    if (ReqBody.CustomerpartsList.length > 0) {
        var AddRecAvail = false;
        var sql = `insert into tbl_customer_parts(PartId,CustomerId,NewPrice,LastPricePaid,Created,CreatedBy,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseNewPrice) values`;
        for (let val of ReqBody.CustomerpartsList) {
            var Obj = new CustomerPartsModel(val);
            if (!Obj.CustomerPartId) {
                AddRecAvail = true;
                sql += `('${Obj.PartId}','${ReqBody.CustomerId}','${Obj.NewPrice}','${Obj.LastPricePaid}','${Obj.Created}','${Obj.CreatedBy}','${Obj.LocalCurrencyCode}','${Obj.ExchangeRate}','${Obj.BaseCurrencyCode}','${Obj.BaseNewPrice}'),`;
            }
        }
        var sql = sql.slice(0, -1);
        if (AddRecAvail) {
            con.query(sql, (err, res) => {
                if (err)
                    return result(err, null);
            });
        }
        for (let val of ReqBody.CustomerpartsList) {
            var Obj = new CustomerPartsModel(val);
            if (Obj.CustomerPartId) {
                var Query = `Update  tbl_customer_parts set  PartId=?,NewPrice=?,LastPricePaid=?,Modified=?,ModifiedBy=?,LocalCurrencyCode=?,ExchangeRate=?,BaseCurrencyCode=?,BaseNewPrice=? where CustomerId=? and CustomerPartId=?`;
                var values = [Obj.PartId, Obj.NewPrice, Obj.LastPricePaid, Obj.Modified, Obj.ModifiedBy, Obj.LocalCurrencyCode, Obj.ExchangeRate, Obj.BaseCurrencyCode, Obj.BaseNewPrice, ReqBody.CustomerId, Obj.CustomerPartId];
                con.query(Query, values, (err, res1) => {
                    if (err)
                        return result(err, null);
                });
            }
        }
        return result(null, ReqBody.CustomerpartsList);
    } else {
        return result({ msg: "Parts data is empty" }, null);
    }
};

//To delete the parts
CustomerPartsModel.delete = (CustomerPartId, result) => {
    if (CustomerPartId) {
        var Obj = new CustomerPartsModel({
            CustomerPartId: CustomerPartId
        });
        var Query = `Update  tbl_customer_parts set  IsDeleted=?,Modified=?,ModifiedBy=? where CustomerPartId=?`;
        var values = [1, Obj.Modified, Obj.ModifiedBy, Obj.CustomerPartId];
        con.query(Query, values, (err, res) => {
            if (err)
                return result(err, null);
            return result(null, res);
        });
    } else {
        return result({ msg: "Customer part id is required" }, null);
    }
}
module.exports = CustomerPartsModel, CustomerPartModelImport;