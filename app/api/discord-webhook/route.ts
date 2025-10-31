import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, ticketId, userEmail, type } = await request.json();

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

    // Determine embed details based on type with robust fallback
    const questionTypes = {
      'interview-question': { title: "📝 Interview Question Submission", color: 0x5865F2, field: "Question Submission" },
      'english-lit-question': { title: "📚 English Literature Submission", color: 0x8B4513, field: "Question Submission" },
      'maths-question': { title: "🔢 Maths Question Submission", color: 0x32CD32, field: "Question Submission" },
      'biology-question': { title: "🧬 Biology Question Submission", color: 0x228B22, field: "Question Submission" },
      'admission-question': { title: "🎯 Admission Test Submission", color: 0xFF6B6B, field: "Question Submission" },
      'general-help': { title: "🎓 General Help Request", color: 0x00CED1, field: "Help Request" }
    };
    
    // Safe type access with fallback to general-help
    const safeType = (type && questionTypes[type as keyof typeof questionTypes]) ? type : 'general-help';
    const questionType = questionTypes[safeType as keyof typeof questionTypes];
    
    const embedTitle = questionType.title;
    const embedColor = questionType.color;
    const contentFieldName = questionType.field;
    const submissionCategory = safeType === 'general-help' ? "General Help" : "Question Practice";

    // Format the Discord message with proper embed
    const discordPayload = {
      embeds: [
        {
          title: embedTitle,
          color: embedColor,
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
              name: "Type",
              value: submissionCategory,
              inline: true
            },
            {
              name: contentFieldName,
              value: content.length > 1024 ? content.substring(0, 1021) + '...' : content,
              inline: false
            }
          ],
          footer: {
            text: safeType === 'general-help' ? "ExamRizz Help Center" : "ExamRizz Question Practice"
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