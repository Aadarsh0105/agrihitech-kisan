const axios = require("axios");

const MSG91_WHATSAPP_URL =
  "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";

const requiredEnv = (name) => {
  const value = String(process.env[name] || "").trim();
  if (!value) throw new Error(`WhatsApp OTP is not configured: ${name} is missing`);
  return value;
};

const normalizeIndianMobile = (mobile) => {
  const digits = String(mobile || "").replace(/\D/g, "");
  const nationalNumber = digits.startsWith("91") && digits.length === 12
    ? digits.slice(2)
    : digits;

  if (!/^\d{10}$/.test(nationalNumber)) {
    throw new Error("Mobile number must contain exactly 10 digits");
  }

  return `91${nationalNumber}`;
};

const providerError = (error) => {
  const responseData = error?.response?.data;
  let parsedData = responseData;

  if (typeof responseData === "string") {
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }
  }

  const detail = parsedData?.message
    || parsedData?.error
    || parsedData?.errors?.[0]?.message
    || parsedData?.data?.message
    || parsedData?.data?.error
    || (typeof parsedData === "string" ? parsedData : "");

  if (detail) return `MSG91 WhatsApp OTP failed: ${detail}`;
  if (error?.code === "ECONNABORTED") return "MSG91 WhatsApp OTP request timed out";
  if (error?.response?.status) {
    const safeResponse = JSON.stringify(parsedData || {}).slice(0, 500);
    return `MSG91 WhatsApp OTP failed (${error.response.status}): ${safeResponse}`;
  }
  return "Unable to send WhatsApp OTP. Please try again.";
};

exports.sendWhatsAppOtp = async ({ mobile, otp }) => {
  const authkey = requiredEnv("MSG91_AUTH_KEY");
  const integratedNumber = requiredEnv("MSG91_WHATSAPP_INTEGRATED_NUMBER");
  const templateName = requiredEnv("MSG91_WHATSAPP_TEMPLATE_NAME");
  const languageCode = String(process.env.MSG91_WHATSAPP_LANGUAGE || "en").trim();
  const namespace = String(process.env.MSG91_WHATSAPP_TEMPLATE_NAMESPACE || "").trim();
  const bodyComponent = String(process.env.MSG91_WHATSAPP_OTP_BODY_COMPONENT || "body_1").trim();
  const buttonComponent = String(process.env.MSG91_WHATSAPP_OTP_BUTTON_COMPONENT || "button_1").trim();

  const components = {
    [bodyComponent]: { type: "text", value: String(otp) },
  };

  if (buttonComponent) {
    components[buttonComponent] = {
      subtype: "url",
      type: "text",
      value: String(otp),
    };
  }

  const template = {
    name: templateName,
    language: { code: languageCode, policy: "deterministic" },
    to_and_components: [{
      to: [normalizeIndianMobile(mobile)],
      components,
    }],
  };

  if (namespace) template.namespace = namespace;

  try {
    const response = await axios.post(
      MSG91_WHATSAPP_URL,
      {
        integrated_number: integratedNumber.replace(/\D/g, ""),
        content_type: "template",
        payload: {
          messaging_product: "whatsapp",
          type: "template",
          template,
        },
      },
      {
        headers: { authkey, "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const data = response.data || {};
    if (data.type === "error" || data.status === "error" || data.hasError === true) {
      const providerFailure = new Error("MSG91 rejected the WhatsApp OTP request");
      providerFailure.response = { data };
      throw providerFailure;
    }

    return data;
  } catch (error) {
    throw new Error(providerError(error));
  }
};
