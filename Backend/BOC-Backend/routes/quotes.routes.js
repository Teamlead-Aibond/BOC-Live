/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const quotes = require("../controllers/quotes.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT); 

router.post("/create", authenticateJWT, quotes.create);
router.post("/AutoCreate", authenticateJWT, quotes.AutoCreate);
router.put("/update", authenticateJWT, quotes.update);
router.put("/updatecustomerquote", authenticateJWT, quotes.updatecustomerquote);
router.post("/view", authenticateJWT, quotes.findOne);
router.post("/getQuoteListByServerSide", authenticateJWT, quotes.getQuoteListByServerSide);
router.post("/deleteQuoteItem", authenticateJWT, quotes.DeleteQuoteItem);

router.post("/submitQuoteToCustomer", authenticateJWT, quotes.submitQuoteToCustomer);
router.post("/approveCustomerQuote", authenticateJWT, quotes.approveCustomerQuote);
router.post("/UpdateCustomerPONoInRR", authenticateJWT, quotes.UpdateCustomerPONoInRR);
router.post("/rejectCustomerQuote", authenticateJWT, quotes.rejectCustomerQuote);
router.post("/SendEmailToCustomerQuoteByQuoteList", authenticateJWT, quotes.SendEmailToCustomerQuoteByQuoteList);
// router.post("/SendQuoteEmail", authenticateJWT,quotes.SendQuoteEmail);
router.post("/delete", authenticateJWT, quotes.delete);
router.post("/SaveAndCreateCustomerQuote", authenticateJWT, quotes.SaveAndCreateCustomerQuote);
// router.post("/GetEmailContentForQuote",authenticateJWT,quotes.GetEmailContentForQuote); 
router.post("/ExportToExcel", authenticateJWT, quotes.ExportToExcel);
router.post("/ViewMultipleQuotesId", authenticateJWT, quotes.ViewMultipleQuotesId);
router.post("/ViewMultipleQuotesId1", authenticateJWT, quotes.ViewMultipleQuotesId1);
router.post("/SaveAndSubmitToCustomer", authenticateJWT, quotes.SaveAndSubmitToCustomer);

//MRO Section :
router.post("/SaveAndCreateMROCustomerQuote", authenticateJWT, quotes.SaveAndCreateMROCustomerQuote);
router.post("/MROQuoteView", authenticateJWT, quotes.findByMROId);
router.put("/UpdateMROCustomerQuote", authenticateJWT, quotes.UpdateMROCustomerQuote);
router.post("/SubmitMROQuoteToCustomer", authenticateJWT, quotes.SubmitMROQuoteToCustomer);
router.post("/ApproveMROCustomerQuote", authenticateJWT, quotes.ApproveMROCustomerQuote);
router.post("/RejectMROCustomerQuote", authenticateJWT, quotes.RejectMROCustomerQuote);
//router.post("/SendEmailToMROCustomerQuoteByQuoteList", authenticateJWT, quotes.SendEmailToMROCustomerQuoteByQuoteList);
router.post("/MROAutoCreate", authenticateJWT, quotes.MROAutoCreate);
router.put("/UpdateMROSingleCustomerQuoteItem", authenticateJWT, quotes.UpdateMROSingleCustomerQuoteItem);
router.post("/ViewMROSingleCustomerQuoteItem", authenticateJWT, quotes.ViewSingleCustomerQuoteItem);
router.post("/DuplicateQuote", authenticateJWT, quotes.DuplicateQuote);
router.post("/viewQuoteItemUsingPartIdAndMROId", authenticateJWT, quotes.viewQuoteItemUsingPartIdAndMROId);

module.exports = router;