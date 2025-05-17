# NextStep AI - Content Creation Agency Website

A modern website for NextStep AI that helps create AI-powered content for different social media platforms.

## Setup Guide (No Coding Required)

### 1. Create Required Accounts

1. **Supabase Account (For Database & Login)**
   - Go to [Supabase.com](https://supabase.com)
   - Click "Sign Up"
   - Use your GitHub account or email to sign up
   - Create a new project:
     - Click "New Project"
     - Give it a name (e.g., "NextStep AI")
     - Choose a strong database password (save it somewhere safe)
     - Select the region closest to you
     - Click "Create Project"
   - Once created, go to "Settings" → "API" in the sidebar
   - Copy and save your:
     - Project URL
     - `anon public` key
   - Go to "Authentication" → "Providers" in the sidebar
   - Enable "Email" provider and save changes

2. **OpenAI Account (For AI Content)**
   - Go to [OpenAI.com](https://openai.com)
   - Click "Sign Up"
   - Create your account
   - Go to [API Keys page](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Give it a name (e.g., "NextStep AI")
   - Copy and save the key immediately (you won't see it again!)

3. **Gmail Account (For Sending Emails)**
   - Go to your [Google Account Settings](https://myaccount.google.com)
   - Click "Security"
   - Enable "2-Step Verification" if not already enabled
   - Go back to Security and click "App Passwords"
   - Select:
     - App: Mail
     - Device: Other (Custom name)
     - Enter "NextStep AI"
   - Click "Generate"
   - Copy and save the 16-character password

### 2. Website Setup

1. **Vercel Account (For Hosting)**
   - Go to [Vercel.com](https://vercel.com)
   - Click "Sign Up"
   - Use your GitHub account to sign up
   - After signing in:
     - Click "New Project"
     - Choose "Import Git Repository"
     - Select this repository
     - Click "Import"

2. **Configure Environment Variables**
   - In your Vercel project:
     - Click "Settings" tab
     - Click "Environment Variables"
     - Add each of these variables (copy exactly, fill with your saved values):

     | Variable Name | Value to Use |
     |--------------|--------------|
     | SUPABASE_URL | Your Supabase Project URL |
     | SUPABASE_ANON_KEY | Your Supabase anon public key |
     | OPENAI_API_KEY | Your OpenAI API key |
     | SMTP_HOSTNAME | smtp.gmail.com |
     | SMTP_PORT | 587 |
     | SMTP_USERNAME | Your Gmail address |
     | SMTP_PASSWORD | Your Gmail app password |
     | SMTP_FROM_EMAIL | Your Gmail address |

   - Click "Save" after adding each one
   - Click "Redeploy" at the top of the page

### 3. Testing Your Setup

1. **Test User Registration**
   - Go to your website (the URL Vercel gave you)
   - Click "Sign Up"
   - Create an account with your email
   - Check your email for verification link
   - Click the verification link
   - Try logging in with your email and password

2. **Test Content Generation**
   - After logging in:
   - Fill in:
     - Business Name
     - Choose a Content Goal
     - Select Content Vibe
     - Click platform buttons (e.g., LinkedIn, Instagram)
   - Click "Generate Content"
   - Wait for content to appear
   - Check your email for the generated content

### Troubleshooting

If something's not working, check these common issues:

1. **Can't Log In?**
   - Make sure you verified your email
   - Check if you're using the correct password
   - Try clearing your browser cache
   - Try in a different browser

2. **Content Generation Not Working?**
   - Check if you're logged in
   - Make sure you selected at least one platform
   - Fill in all required fields
   - If still not working, contact support

3. **Not Receiving Emails?**
   - Check your spam folder
   - Verify your email address is correct
   - Try generating content again
   - Contact support if issues persist

Need help? Contact support at: [your-support-email]

## License

MIT License - feel free to use for your own projects!