// Safely disable performance monitoring
export const disablePerformanceMonitoring = () => {
  try {
    // Remove any existing performance observers
    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver(() => {});
      observer.disconnect();
    }

    // Override postMessage to sanitize performance data
    const originalPostMessage = window.postMessage;
    window.postMessage = function (
      message: any,
      targetOrigin: string,
      transfer?: Transferable[],
    ) {
      try {
        // Sanitize the message by removing non-serializable objects
        const sanitizedMessage = JSON.parse(JSON.stringify(message));
        return originalPostMessage.call(
          this,
          sanitizedMessage,
          targetOrigin,
          transfer,
        );
      } catch (e) {
        console.warn("Failed to post message:", e);
        return originalPostMessage.call(
          this,
          { type: "ERROR", error: "Message contained non-serializable data" },
          targetOrigin,
        );
      }
    };
  } catch (error) {
    console.warn("Failed to disable performance monitoring:", error);
  }
};
