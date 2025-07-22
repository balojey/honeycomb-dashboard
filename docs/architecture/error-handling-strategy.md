# Error Handling Strategy

  * **Format:** The BFF will return a standardized `ApiError` JSON object for all errors.
  * **Flow:** The frontend catches errors from the BFF, logs technical details, and shows a user-friendly toast notification. The BFF catches errors from the Honeycomb API, logs technical details, and formats the `ApiError` response.
