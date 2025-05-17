# NextStep AI - Content Creation Agency Website

A modern website for NextStep AI that helps create AI-powered content for different social media platforms. This guide will help you set up everything, even if you've never coded before!

## What This Website Does

- Creates content for LinkedIn, Instagram, Facebook, and YouTube
- Lets users sign up and log in
- Generates AI content based on your business needs
- Sends the generated content to your email
- Works great on mobile phones and computers

## Step-by-Step Setup Guide for Non-Coders

### 1. Getting the Code from GitHub

1. Go to GitHub.com and create an account if you don't have one
2. Click the green "Code" button on this page
3. Click "Download ZIP"
4. Extract the ZIP file to a folder on your computer

### 2. Setting Up Supabase (Database & Authentication)

1. Go to [Supabase.com](https://supabase.com)
2. Click "Sign Up" and create an account using your GitHub account
3. After signing in, click "New Project"
4. Fill in the project details:
   - Name: "NextStep AI" (or any name you prefer)
   - Database Password: Create a strong password and save it somewhere safe
   - Region: Choose the closest to your location
   - Pricing Plan: Free tier
5. Click "Create New Project" and wait for it to be created (about 1 minute)
6. Once created, you'll see the project dashboard
7. In the left sidebar, click "SQL Editor"
8. Copy and paste this exactly as shown:
   ```sql
   create table generated_content (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users(id),
     platform text not null,
     content text not null,
     business_name text not null,
     content_goal text not null,
     content_vibe text not null,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```
9. Click "Run" to create the table
10. In the left sidebar, click "Project Settings"
11. Copy the following values and save them somewhere safe:
    - Project URL
    - anon public key
    These will be needed later!

### 3. Setting Up OpenAI (for AI Content Generation)

1. Go to [OpenAI.com](https://openai.com)
2. Click "Sign Up" and create an account
3. Once logged in, click on your profile icon in the top-right
4. Click "View API Keys"
5. Click "Create New Secret Key"
6. Copy the key and save it somewhere safe (you won't be able to see it again!)

### 4. Setting Up Email (for Notifications)

You can use Gmail for sending emails. Here's how to set it up:

1. Go to your Google Account settings
2. Search for "App Passwords" or go to Security → App Passwords
3. Create a new app password
4. Save the generated password somewhere safe

### 5. Setting Up Vercel (for Hosting)

1. Go to [Vercel.com](https://vercel.com)
2. Sign up using your GitHub account
3. Click "New Project"
4. Choose "Import Git Repository"
5. Select the repository you created
6. Click "Deploy"
7. Once deployed, click "Settings"
8. Click "Environment Variables"
9. Add the following variables (copy exactly, fill in your values):
   ```
   SUPABASE_URL=your_project_url_from_step_2
   SUPABASE_ANON_KEY=your_anon_key_from_step_2
   OPENAI_API_KEY=your_openai_key_from_step_3
   SMTP_HOSTNAME=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_gmail_address
   SMTP_PASSWORD=your_app_password_from_step_4
   SMTP_FROM_EMAIL=your_gmail_address
   ```
10. Click "Save"
11. Click "Redeploy" at the top of the page

### 6. Final Steps

1. Go back to your Supabase dashboard
2. Click "Authentication" in the left sidebar
3. Click "URL Configuration"
4. Add your Vercel URL (it will look like https://your-project.vercel.app) to:
   - Site URL
   - Additional Redirect URLs

### 7. Testing Everything

1. Go to your Vercel URL
2. Click "Sign Up" and create an account
3. Try generating content:
   - Enter your business name
   - Choose a content goal
   - Select the platforms you want content for
   - Click "Generate Content"
4. Check your email for the generated content

### Need Help?

If anything isn't working:
1. Double-check all the keys and passwords are copied correctly
2. Make sure you've saved all changes in Vercel and Supabase
3. Try logging out and logging back in
4. Contact support at [your-support-email]

### Customizing Your Website

Want to change how the website looks? Here are some simple things you can change:

1. Text and Headlines:
   - Open `index.html` in a text editor
   - Find the text you want to change
   - Update it to your preferred wording

2. Colors:
   - Open `styles.css` in a text editor
   - Look for `:root`
   - Change the color codes to your preferred colors
   (You can use a color picker website like [color.adobe.com](https://color.adobe.com) to find color codes)

3. Images:
   - Replace the images in the `images` folder with your own
   - Keep the same filenames:
     - feature1.jpg
     - feature2.jpg
     - feature3.jpg
   - Make sure your images are similar in size (recommended: 800x600 pixels)

Remember to save all files after making changes and redeploy on Vercel!

## Features

- Mobile-first responsive design
- Smooth scrolling navigation
- Scroll-based animations
- Modern UI with clear call-to-action buttons
- Trust elements (ratings, user count, etc.)
- User authentication with Supabase
- AI-powered content generation
- Multi-platform content support (LinkedIn, Instagram, Facebook, YouTube)
- Email notifications for generated content

## Setup Instructions

1. Clone this repository
2. Set up Supabase:
   - Create a new project at [Supabase](https://supabase.com)
   - Copy your project URL and anon key
   - Create the following tables in your Supabase database:
     ```sql
     -- Users table (handled by Supabase Auth)
     -- Generated content table
     create table generated_content (
       id uuid default uuid_generate_v4() primary key,
       user_id uuid references auth.users(id),
       platform text not null,
       content text not null,
       business_name text not null,
       content_goal text not null,
       content_vibe text not null,
       created_at timestamp with time zone default timezone('utc'::text, now())
     );
     ```

3. Set up environment variables:
   - Create a `.env` file with the following variables:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     OPENAI_API_KEY=your_openai_api_key
     SMTP_HOSTNAME=your_smtp_hostname
     SMTP_PORT=your_smtp_port
     SMTP_USERNAME=your_smtp_username
     SMTP_PASSWORD=your_smtp_password
     SMTP_FROM_EMAIL=your_from_email
     ```

4. Deploy Edge Functions:
   ```bash
   supabase functions deploy generate-content
   supabase functions deploy send-email-notification
   ```

5. Deploy to Vercel:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the project directory
   - Follow the prompts to deploy
   - Set up your environment variables in the Vercel dashboard

## Required Images

The website needs three feature images in the `/images` directory:

1. `feature1.jpg` - Represents Smart Content Generation
   - Suggested content: AI writing/content creation visualization
   - Recommended size: 800x600px
   - Format: JPG or PNG

2. `feature2.jpg` - Represents SEO Optimization
   - Suggested content: Search engine rankings or SEO metrics visualization
   - Recommended size: 800x600px
   - Format: JPG or PNG

3. `feature3.jpg` - Represents Analytics Dashboard
   - Suggested content: Data analytics dashboard or graphs
   - Recommended size: 800x600px
   - Format: JPG or PNG

You can use stock photos or custom images that match these themes. Make sure the images are:
- High quality and professional looking
- Relevant to the feature they represent
- Consistent in style and color scheme
- Properly compressed for web use

## Development

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start local development:
   ```bash
   supabase start
   ```

3. Run the website locally:
   ```bash
   npx serve
   ```

## Email Integration with Zapier/n8n

To set up email automation:

1. Create a new Zapier/n8n workflow
2. Trigger: Supabase database insert (generated_content table)
3. Action: Send email
4. Configure the email template using the data from the trigger
5. Test and enable the workflow

## Browser Support

The website is compatible with all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Customization

You can easily customize the website by:
1. Modifying colors in the `:root` section of `styles.css`
2. Updating content in `index.html`
3. Adjusting animations in `script.js`
4. Modifying the content generation prompts in the Edge Functions 