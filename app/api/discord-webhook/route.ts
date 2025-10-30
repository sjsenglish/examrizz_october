import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, ticketId, userEmail } = await request.json();

    if (!content || !ticketId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('Discord webhook URL not configured');
      return NextResponse.json(
        { error: 'Discord webhook not configured' },
        { status: 500 }
      );
    }

    // Format the Discord message with proper embed
    const discordPayload = {
      embeds: [
        {
          title: "🎓 New Teacher Help Request",
          color: 0x00CED1, // Teal color to match site theme
          fields: [
            {
              name: "Ticket ID",
              value: ticketId,
              inline: true
            },
            {
              name: "User",
              value: userEmail || 'Anonymous',
              inline: true
            },
            {
              name: "Timestamp",
              value: new Date().toLocaleString(),
              inline: true
            },
            {
              name: "Conversation Context",
              value: content.length > 1024 ? content.substring(0, 1021) + '...' : content,
              inline: false
            }
          ],
          footer: {
            text: "ExamRizz Help Center"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to send ticket to Discord' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      ticketId,
      message: 'Ticket created successfully'
    });

  } catch (error) {
    console.error('Error creating Discord ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}