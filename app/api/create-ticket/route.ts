import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId } = await request.json();

    if (!userId || !sessionId) {
      return NextResponse.json({ error: 'userId and sessionId are required' }, { status: 400 });
    }

    if (!process.env.DISCORD_WEBHOOK_URL) {
      return NextResponse.json({ error: 'Discord webhook not configured' }, { status: 500 });
    }

    // Get user profile with Discord info
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('discord_id, discord_username, id')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (!userProfile.discord_id) {
      return NextResponse.json({ error: 'Discord account not linked' }, { status: 400 });
    }

    // Get user email from auth
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get last 6 messages from the session
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('role, content, created_at')
      .eq('conversation_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(6);

    if (messagesError) {
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages found in session' }, { status: 400 });
    }

    // Reverse to get chronological order
    const recentMessages = messages.reverse();

    // Format conversation for Discord embed
    const conversationText = recentMessages.map(msg => {
      const timestamp = new Date(msg.created_at).toLocaleString();
      const sender = msg.role === 'user' ? 'Student' : 'Bo (Assistant)';
      const content = msg.content.length > 200 ? msg.content.substring(0, 200) + '...' : msg.content;
      return `**${sender}** (${timestamp}):\n${content}\n`;
    }).join('\n');

    // Create Discord embed
    const discordEmbed = {
      embeds: [{
        title: "🎓 Support Ticket - Buddy Chat",
        description: "A student has requested support from their Buddy Chat session.",
        color: 0x4F46E5, // Primary color
        fields: [
          {
            name: "👤 Student Information",
            value: `**Email:** ${user.email}\n**Discord:** ${userProfile.discord_username || 'Unknown'}\n**User ID:** ${userId}`,
            inline: false
          },
          {
            name: "💬 Recent Conversation",
            value: conversationText.length > 1000 ? conversationText.substring(0, 1000) + '...' : conversationText,
            inline: false
          },
          {
            name: "🔗 Session Details",
            value: `**Session ID:** ${sessionId}\n**Messages Count:** ${recentMessages.length}\n**Latest Activity:** ${new Date(recentMessages[recentMessages.length - 1]?.created_at).toLocaleString()}`,
            inline: false
          }
        ],
        footer: {
          text: "ExamRizz Support System",
          icon_url: "https://examrizz.com/icon.png" // Optional: add your logo
        },
        timestamp: new Date().toISOString()
      }],
      content: `🚨 **New Support Ticket**\n\n<@&YOUR_TEACHER_ROLE_ID> - A student needs assistance with their personal statement work.` // Replace with actual role ID
    };

    // Send to Discord webhook
    const discordResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordEmbed)
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error('Discord webhook error:', errorText);
      return NextResponse.json({ error: 'Failed to send Discord message' }, { status: 500 });
    }

    // Log the ticket creation for tracking
    const { error: logError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        session_id: sessionId,
        discord_username: userProfile.discord_username,
        status: 'open',
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.warn('Failed to log ticket creation:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Support ticket created successfully',
      discord_username: userProfile.discord_username 
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}