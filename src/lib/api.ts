/**
 * API client functions for prayer requests and other backend operations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('[API] Using base URL:', API_BASE_URL);

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
    const url = `${API_BASE_URL}/api/sendPrayer`;
    console.log('[API] Sending prayer to:', url);
    
    const response = await fetch(url, {
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

/**
 * Verify if a user is an admin
 * @param email - User email to verify
 * @returns Promise with admin verification response
 */
export async function verifyAdmin(email: string): Promise<ApiResponse> {
  try {
    const url = `${API_BASE_URL}/api/verify-admin`;
    console.log('[API] Verifying admin at:', url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: "Admin verification successful",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error('[API] Verification error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
      message: `Admin verification failed: ${errorMessage}`,
    };
  }
}
