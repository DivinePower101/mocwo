/**
 * API client functions for prayer requests and other backend operations
 */

export interface PrayerRequestPayload {
  name: string;
  phone: string;
  location: string;
  prayer: string;
  method: "sms" | "whatsapp" | "email";
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Send a prayer request to the server via SMS or WhatsApp
 * @param payload - Prayer request details including name, phone, location, prayer text, and method
 * @returns Promise with API response
 */
export async function sendPrayerRequest(
  payload: PrayerRequestPayload
): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/sendPrayer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: data.message || "Prayer request sent successfully",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
      message: `Failed to send prayer request: ${errorMessage}`,
    };
  }
}
