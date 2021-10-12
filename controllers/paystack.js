const axios = require("axios");
const config = require("../config/config");

//Initialize Payments using the Paystack API
exports.initializeTransaction = async (form) => {
  const req_options = {
    url: "https://api.paystack.co/transaction/initialize",
    headers: {
      authorization: `Bearer ${process.env.paystack_test_key}`,
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    method: "POST",
    data: form,
  };
  return new Promise(async () => {
    try {
      const req_data = await axios.request(req_options);
      console.log(req_data);
      const { status, statusText, data } = req_data;
      return { status: status, message: statusText, data: data };
    } catch (error) {
      return {
        status: error.req_data.status,
        message: error.req_data.data.message,
        data: {},
      };
    }
  });
};

//Verify Payments before updating account balance in DB
exports.verifyPayment = async (ref) => {
  const options = {
    url:
      "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
    headers: {
      authorization: `Bearer ${process.env.paystack_test_key}`,
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    method: "GET",
  };
  return new Promise(async (resolve, reject) => {
    try {
      const data = await axios.request(options);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
