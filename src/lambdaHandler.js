exports.lambdaHandler = async (event) => {
  try {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map(
      (origin) => origin.toLowerCase()
    );

    const origin = event.headers.origin?.toLowerCase() || ""; // Handle cases where origin is null/undefined

    if (event.httpMethod === "OPTIONS") {
      if (allowedOrigins.includes(origin)) {
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: "", // Empty body for OPTIONS responses is common
        };
      } else {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "CORS Origin Not Allowed" }),
        };
      }
    }

    if (event.httpMethod === "POST") {
      if (allowedOrigins.includes(origin)) {
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ message: "Hello World" }),
        };
      } else {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "CORS Origin Not Allowed" }),
        };
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid Method" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error, Please Try Again",
      }),
    };
  }
};
