import { asyncErrorHandler } from "../utils/errors/asyncErrorHandler.js";
import { sendOrderMail } from "../utils/sendOrderMail.js";



export const OrderMail = asyncErrorHandler(async (req, res, next) => {
  const {email,name} = req?.body

    const { paymentMethode, time,items, totalAmount,orderNumber,orderType } = req?.body?.data;
    const amount= (Number(totalAmount?.total) + Number(totalAmount?.deliveryCharge) - Number(totalAmount?.discountPrice || 0)).toFixed(2)

    let paymentMode = ""
    if(paymentMethode==="Cash on delivery" && orderType==="collection"){
paymentMode= "Pay on Collection"
    }
    else if(paymentMethode==="Cash on delivery" && orderType==="delivery"){
      paymentMode= "Pay on Delivery"
    }
    else{
      paymentMode= paymentMethode
    }
  
    sendOrderMail(email, orderNumber, amount, time, paymentMode,orderType,items,name).then(() => {

          return res
            .status(200)
            .json({ success: true, message: "OTP sent successfully" });
        }
      ).catch((error) => {
        return res.status(400).json({
          success: false,
          message: `Unable to send mail! ${error.message}`,
        });
      });
  });
  