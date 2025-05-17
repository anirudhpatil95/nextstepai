# NextStep AI - Content Creation Agency Website

A modern website for NextStep AI that helps create AI-powered content for different social media platforms.

## Quick Start Guide (For Non-Technical Users)

### 1. Getting Started
1. Download the code from GitHub (green "Code" button → "Download ZIP")
2. Extract the ZIP file to a folder on your computer

### 2. Setting Up Your Services
1. **Supabase (Database & Login)**
   - Sign up at [Supabase.com](https://supabase.com)
   - Create a new project
   - Save your Project URL and anon public key
   - Enable Email Authentication in Settings

2. **OpenAI (AI Content)**
   - Sign up at [OpenAI.com](https://openai.com)
   - Create an API key
   - Save the key securely

3. **Email Setup (Gmail)**
   - Go to Google Account settings
   - Create an App Password
   - Save the password securely

### 3. Deploying Your Website
1. Sign up at [Vercel.com](https://vercel.com)
2. Import your code
3. Add your saved keys as Environment Variables
4. Deploy!

## Troubleshooting Guide

### Common Issues and Solutions

1. **Login/Signup Not Working**
   - Check if Supabase URL and key are correct in environment variables
   - Verify Email Authentication is enabled in Supabase
   - Clear browser cache and try again
   - Check browser console for specific error messages

2. **Content Generation Fails**
   - Verify OpenAI API key is correct
   - Check if you have sufficient API credits
   - Try with shorter content requirements
   - Check browser console for error details

3. **Email Notifications Not Received**
   - Check spam folder
   - Verify Gmail app password is correct
   - Ensure email settings in environment variables are correct
   - Try sending a test email through the system

4. **Website Not Loading**
   - Clear browser cache
   - Try a different browser
   - Check internet connection
   - Verify Vercel deployment status

5. **Changes Not Reflecting**
   - Wait a few minutes for changes to propagate
   - Try hard refresh (Ctrl+F5)
   - Check Vercel deployment logs
   - Verify changes were committed and pushed

### Test Examples

1. **Test Login**
```json
{
    "email": "test@example.com",
    "password": "TestPassword123!"
}
```

2. **Test Content Generation**
```json
{
    "businessName": "Tech Startup",
    "contentGoal": "Product Launch",
    "contentVibe": "Professional",
    "platforms": ["linkedin", "instagram"]
}
```

3. **Test Email Notification**
```json
{
    "userId": "user-id",
    "contents": [
        {
            "platform": "linkedin",
            "content": "Example content for LinkedIn"
        }
    ]
}
```

### Error Messages and Solutions

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Authentication failed" | Invalid credentials or missing setup | Check Supabase settings and environment variables |
| "API rate limit exceeded" | Too many requests to OpenAI | Wait or upgrade API plan |
| "Email sending failed" | Incorrect SMTP settings | Verify Gmail app password and settings |
| "Content generation failed" | OpenAI API issues | Check API key and request format |
| "Database error" | Supabase connection issues | Verify database URL and permissions |

## Technical Documentation

### Project Structure
```
/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # Core JavaScript
├── images/         # Website images
└── supabase/       # Supabase functions
```

### Environment Variables Setup

You need to set up environment variables in both Vercel and Supabase:

#### 1. Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the following variables:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   OPENAI_API_KEY=your_openai_key
   SMTP_HOSTNAME=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_gmail
   SMTP_PASSWORD=your_app_password
   SMTP_FROM_EMAIL=your_gmail
   ```

#### 2. Supabase Edge Functions
1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref your-project-id`
4. Set the secrets:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_key
   supabase secrets set SMTP_HOSTNAME=smtp.gmail.com
   supabase secrets set SMTP_PORT=587
   supabase secrets set SMTP_USERNAME=your_gmail
   supabase secrets set SMTP_PASSWORD=your_app_password
   supabase secrets set SMTP_FROM_EMAIL=your_gmail
   ```

> **Important**: Never commit these values to your repository. Always use environment variables!

### API Endpoints

#### Content Generation
```javascript
POST /generate-content
{
    "businessName": string,
    "contentGoal": string,
    "contentVibe": string,
    "platform": string,
    "userId": string
}
```

#### Email Notification
```javascript
POST /send-email-notification
{
    "userId": string,
    "contents": Array<{
        platform: string,
        content: string
    }>
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use for your own projects!