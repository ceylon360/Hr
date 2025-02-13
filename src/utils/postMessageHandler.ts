export const safePostMessage = (data: any) => {
  try {
    // Clone and sanitize the data before posting
    const sanitizedData = JSON.parse(JSON.stringify(data));
    window.postMessage(sanitizedData, "*");
  } catch (error) {
    console.error("Error posting message:", error);
    // Send a simplified version if the full data can't be cloned
    window.postMessage(
      { type: "ERROR", message: "Failed to send complete data" },
      "*",
    );
  }
};

export const setupMessageListener = (
  callback: (event: MessageEvent) => void,
) => {
  const handler = (event: MessageEvent) => {
    try {
      callback(event);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  };

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
};
