import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Content {
  platform: string
  content: string
}

interface RequestBody {
  userId: string
  contents: Content[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, contents } = await req.json() as RequestBody

    // Get user's email from Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // Configure SMTP client
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOSTNAME') ?? '',
      port: parseInt(Deno.env.get('SMTP_PORT') ?? '587'),
      username: Deno.env.get('SMTP_USERNAME') ?? '',
      password: Deno.env.get('SMTP_PASSWORD') ?? '',
    })

    // Create email content
    const emailContent = contents.map(({ platform, content }) => `
      <h2>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h2>
      <div>${content}</div>
      <hr>
    `).join('')

    // Send email
    await client.send({
      from: Deno.env.get('SMTP_FROM_EMAIL') ?? '',
      to: userData.email,
      subject: 'Your Generated Content from NextStep AI',
      content: `
        <html>
          <body>
            <h1>Your Generated Content</h1>
            ${emailContent}
            <p>Thank you for using NextStep AI!</p>
          </body>
        </html>
      `,
      html: true,
    })

    await client.close()

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
}) 