import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  businessName: string
  contentGoal: string
  contentVibe: string
  platform: string
  userId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { businessName, contentGoal, contentVibe, platform } = await req.json() as RequestBody

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Platform-specific prompts
    const platformPrompts = {
      linkedin: `Create a professional LinkedIn post for ${businessName} about their ${contentGoal}. The tone should be ${contentVibe}. Include relevant hashtags.`,
      instagram: `Create an engaging Instagram caption for ${businessName} about their ${contentGoal}. The tone should be ${contentVibe}. Include relevant hashtags and emojis.`,
      facebook: `Create a Facebook post for ${businessName} about their ${contentGoal}. The tone should be ${contentVibe}. Include a call to action.`,
      youtube: `Create a YouTube video description for ${businessName} about their ${contentGoal}. The tone should be ${contentVibe}. Include timestamps and relevant links.`
    }

    // Generate content using OpenAI
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: platformPrompts[platform as keyof typeof platformPrompts],
      max_tokens: 500,
      temperature: 0.7,
    })

    const generatedContent = completion.data.choices[0].text?.trim()

    return new Response(
      JSON.stringify({ content: generatedContent }),
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