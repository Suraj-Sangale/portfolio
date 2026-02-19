import { apiList } from "../internals";

const callFetchMethod = (
  apiEndpoint,
  payload = {},
  authToken = "",
  method = "POST",
  variables = {},
) => {
  return new Promise((resolve, reject) => {
    Object.keys(variables).forEach(function (key) {
      apiEndpoint = apiEndpoint.replace(key, variables[key], apiEndpoint);
    });

    const apiParams = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Tata Neu check if it is auto login
    // if (
    //   typeof payload.is_auto_login != "undefined" &&
    //   (payload.is_auto_login == "true" || payload.is_auto_login == "1")
    // ) {
    //   delete payload.is_auto_login;
    //   apiParams["headers"]["Platform"] = process.env.NEU_PLATFORM_NAME;
    // }

    if (method == "POST" || method == "PUT") {
      apiParams["body"] = JSON.stringify(payload);
    }

    // if (authToken && authToken.trim() != "Bearer") {
    //   apiParams["headers"]["Authorization"] = authToken;
    // }

    //  console.log("apiEndpoint", apiEndpoint);
    //  console.log("apiParams", apiParams);

    fetch(apiEndpoint, apiParams)
      .then((response) => {
        // console.log("response", response);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// POST API call to NextJs API
export function postApiData(action, payload = {}) {
  return new Promise((resolve, reject) => {
    if (typeof apiList[action] != "undefined") {
      const apiCall = callFetchMethod(apiList[action], payload);
      //   const apiCall = callFetchMethod(
      //     publicRuntimeConfig.basePath + apiList[action],
      //     payload
      //   );

      apiCall
        .then((response) => {
          resolve(response.json());
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

// POST API call to NodeJs API
export function postSiteApiData(
  action,
  payload,
  accessToken = "",
  variables = {},
) {
  return new Promise((resolve, reject) => {
    if (typeof apiList[action] != "undefined") {
      const apiCall = callFetchMethod(
        process.env.NODE_API_URL + apiList[action],
        payload,
        accessToken == "" ? process.env.NODE_API_URL : "Bearer " + accessToken,
        "POST",
        variables,
      );

      apiCall
        .then((response) => {
          const responseData = response.json();
          // console.log("response", responseData);
          resolve(responseData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    }
  });
}
