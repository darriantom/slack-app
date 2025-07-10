import { NextRequest, NextResponse } from 'next/server';

// This function processes incoming Slack slash commands
export async function POST(request: NextRequest) {
  try {
    // Verify that the request is coming from Slack
    // if (!verifySlackRequest(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // Parse the request body as form data (Slack sends data as form/url-encoded)
    const formData = await request.formData();
    
    // Extract relevant information from the Slack command
    const command = formData.get('command') as string;
    const text = formData.get('text') as string;
    const userId = formData.get('user_id') as string;
    
    // Basic validation
    if (!command || !userId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    // Process the command - this is where you'd add your service-related logic
    let response = '';
    
    // Example service-related command processing based on input text
    if (text.includes('search')) {
      response = "🟢 Service is running normally";
    } else if (text.includes('restart')) {
      response = "🔄 Service restart initiated";
      // Here you would call your actual service restart logic
    } else if (text.includes('metrics')) {
      response = "📊 Service metrics:\n- Uptime: 99.9%\n- Response time: 120ms\n- Error rate: 0.01%";
    } else if (text.includes('help')) {
      response = "Available commands:\n- status: Check service status\n- restart: Restart the service\n- metrics: View service metrics\n- help: Show this help message";
    } else {
      response = `Unknown command. Type \`${command} help\` for available commands.`;
    }
    
    // Return response to Slack
    return NextResponse.json({
      response_type: 'in_channel', // 'in_channel' makes the response visible to everyone
      text: response
    });
    
  } catch (error) {
    console.error('Error processing Slack command:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}