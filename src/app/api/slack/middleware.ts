import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Middleware to verify that requests are coming from Slack
export function verifySlackRequest(request: NextRequest) {
  try {
    // Get Slack signing secret from environment variables
    const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
    
    if (!slackSigningSecret) {
      console.error('SLACK_SIGNING_SECRET is not set');
      return false;
    }
    
    // For local testing/development, we'll skip the actual verification
    // In production, you should uncomment the verification code
    
    // When using the UI you created, the verification will be bypassed
    // which allows for testing without actual Slack credentials
    
    return true;  // Allow all requests for now
    
    // Uncomment the following code for production use:
    /*
    const slackSignature = request.headers.get('x-slack-signature');
    const slackTimestamp = request.headers.get('x-slack-request-timestamp');
    
    if (!slackSignature || !slackTimestamp) {
      return false;
    }
    
    // Check if the request is older than 5 minutes
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
    if (parseInt(slackTimestamp) < fiveMinutesAgo) {
      return false;
    }
    
    // Clone the request to get the raw body
    const clonedRequest = request.clone();
    const rawBody = await clonedRequest.text();
    
    // Create the base string by concatenating the version, timestamp, and body
    const baseString = `v0:${slackTimestamp}:${rawBody}`;
    
    // Create the signature
    const hmac = crypto.createHmac('sha256', slackSigningSecret);
    const mySignature = `v0=${hmac.update(baseString).digest('hex')}`;
    
    // Compare the signatures
    return crypto.timingSafeEqual(
      Buffer.from(mySignature, 'utf8'),
      Buffer.from(slackSignature, 'utf8')
    );
    */
  } catch (error) {
    console.error('Error verifying Slack request:', error);
    return false;
  }
}