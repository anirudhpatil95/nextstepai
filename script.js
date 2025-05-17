import { signUp, signIn, signOut, initializeAuth, supabase, currentUser } from './auth.js';

// Initialize Supabase client
const supabaseUrl = 'https://gdvnhzibynjanakeofef.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2bm5oeWlieW5qYW5ha2VvZmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5MjM5MjMsImV4cCI6MjAyMTUwOTkyM30.00000000000000000000000000000000000000000000000000'
const { createClient } = supabase
const supabaseClient = createClient(supabaseUrl, supabaseKey)

// Add global error handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason)
    alert('An unexpected error occurred. Please try again or contact support.')
})

// DOM Elements
const loginBtn = document.getElementById('loginBtn')
const signupBtn = document.getElementById('signupBtn')
const navSignupBtn = document.getElementById('navSignupBtn')
const learnMoreBtn = document.getElementById('learnMoreBtn')
const loginModal = document.getElementById('loginModal')
const signupModal = document.getElementById('signupModal')
const loginForm = document.getElementById('loginForm')
const signupForm = document.getElementById('signupForm')
const mainContent = document.getElementById('mainContent')
const dashboard = document.getElementById('dashboard')
const contentForm = document.getElementById('contentForm')
const platformButtons = document.querySelectorAll('.platform-button')
const generatedContent = document.getElementById('generatedContent')
const closeLoginBtn = document.getElementById('closeLoginModal')
const closeSignupBtn = document.getElementById('closeSignupModal')
const authError = document.getElementById('authError')
const logoutBtn = document.getElementById('logoutBtn')
const switchToSignupBtn = document.getElementById('switchToSignup')
const switchToLoginBtn = document.getElementById('switchToLogin')

// State
let selectedPlatforms = new Set()
let currentUser = null

// Auth Modal Handlers
loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    loginModal.classList.add('active')
    signupModal.classList.remove('active')
    clearAuthErrors()
})

// Add event listener for navigation sign up button
navSignupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    signupModal.classList.add('active')
    loginModal.classList.remove('active')
    clearAuthErrors()
})

// Add event listener for hero section sign up button
signupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    signupModal.classList.add('active')
    loginModal.classList.remove('active')
    clearAuthErrors()
})

// Add event listener for learn more button
learnMoreBtn.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('#features').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
})

// Switch between login and signup
switchToSignupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    loginModal.classList.remove('active')
    signupModal.classList.add('active')
    clearAuthErrors()
})

switchToLoginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    signupModal.classList.remove('active')
    loginModal.classList.add('active')
    clearAuthErrors()
})

// Close modal buttons
closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('active')
    clearAuthErrors()
})

closeSignupBtn.addEventListener('click', () => {
    signupModal.classList.remove('active')
    clearAuthErrors()
})

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active')
        clearAuthErrors()
    }
    if (e.target === signupModal) {
        signupModal.classList.remove('active')
        clearAuthErrors()
    }
})

function clearAuthErrors() {
    const errors = document.querySelectorAll('.error-message')
    errors.forEach(error => error.textContent = '')
}

// Auth Form Handlers
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value.trim()
    const password = document.getElementById('loginPassword').value

    if (!email || !password) {
        showError('loginError', 'Please fill in all fields')
        return
    }

    const result = await signIn(email, password)
    
    if (result.success) {
        loginModal.classList.remove('active')
        clearAuthErrors()
    } else {
        showError('loginError', result.message)
    }
})

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('signupEmail').value.trim()
    const password = document.getElementById('signupPassword').value

    if (!email || !password) {
        showError('signupError', 'Please fill in all fields')
        return
    }

    if (password.length < 6) {
        showError('signupError', 'Password must be at least 6 characters')
        return
    }

    const result = await signUp(email, password)
    
    if (result.success) {
        signupModal.classList.remove('active')
        alert(result.message)
        clearAuthErrors()
    } else {
        showError('signupError', result.message)
    }
})

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId)
    if (errorElement) {
        errorElement.textContent = message
        errorElement.style.color = 'red'
    }
}

// Logout handler
logoutBtn.addEventListener('click', async () => {
    const result = await signOut()
    if (!result.success) {
        alert(result.message)
    }
})

// Platform Selection
platformButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!currentUser) {
            signupModal.classList.add('active')
            return
        }

        const platform = button.dataset.platform
        button.classList.toggle('active')
        
        if (selectedPlatforms.has(platform)) {
            selectedPlatforms.delete(platform)
        } else {
            selectedPlatforms.add(platform)
        }
    })
})

// Content Generation
contentForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
        signupModal.classList.add('active')
        return
    }

    if (selectedPlatforms.size === 0) {
        alert('Please select at least one platform')
        return
    }

    const businessName = document.getElementById('businessName').value.trim()
    const contentGoal = document.getElementById('contentGoal').value.trim()
    const contentVibe = document.getElementById('contentVibe').value.trim()

    // Validate inputs
    if (!businessName || !contentGoal || !contentVibe) {
        alert('Please fill in all required fields')
        return
    }

    const formData = {
        businessName,
        contentGoal,
        contentVibe,
        platforms: Array.from(selectedPlatforms)
    }

    try {
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        
        if (userError) throw new Error('Authentication error: ' + userError.message)
        if (!user) throw new Error('User not authenticated')

        // Show loading state
        const submitButton = contentForm.querySelector('button[type="submit"]')
        const originalButtonText = submitButton.textContent
        submitButton.disabled = true
        submitButton.textContent = 'Generating...'

        // Generate content for each platform
        const generatedContents = await Promise.all(
            formData.platforms.map(async platform => {
                const { data, error } = await supabaseClient.functions.invoke('generate-content', {
                    body: {
                        ...formData,
                        platform,
                        userId: user.id
                    }
                })

                if (error) throw new Error(`Error generating content for ${platform}: ${error.message}`)
                if (!data) throw new Error(`No content generated for ${platform}`)
                return { platform, content: data }
            })
        )

        // Display generated content
        displayGeneratedContent(generatedContents)

        // Store in Supabase with error handling
        const { error: insertError } = await supabaseClient.from('generated_content').insert(
            generatedContents.map(({ platform, content }) => ({
                user_id: user.id,
                platform,
                content,
                business_name: formData.businessName,
                content_goal: formData.contentGoal,
                content_vibe: formData.contentVibe
            }))
        )

        if (insertError) throw new Error('Error saving content: ' + insertError.message)

        // Send email notification with error handling
        const { error: emailError } = await supabaseClient.functions.invoke('send-email-notification', {
            body: {
                userId: user.id,
                contents: generatedContents
            }
        })

        if (emailError) {
            console.error('Error sending email notification:', emailError)
            alert('Content generated successfully but there was an error sending the email notification.')
        } else {
            alert('Content generated successfully! Check your email for the complete content.')
        }

    } catch (error) {
        console.error('Error in content generation:', error)
        alert(error.message || 'Error generating content. Please try again.')
    } finally {
        // Reset button state
        const submitButton = contentForm.querySelector('button[type="submit"]')
        submitButton.disabled = false
        submitButton.textContent = originalButtonText
    }
})

// Helper Functions
function showDashboard() {
    mainContent.style.display = 'none'
    dashboard.classList.add('active')
    loginBtn.style.display = 'none'
    logoutBtn.style.display = 'block'
}

function showLandingPage() {
    mainContent.style.display = 'block'
    dashboard.classList.remove('active')
    loginBtn.style.display = 'block'
    logoutBtn.style.display = 'none'
}

function displayGeneratedContent(contents) {
    generatedContent.innerHTML = contents.map(({ platform, content }) => `
        <div class="content-card">
            <h4>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
            <div class="content-text">${content}</div>
        </div>
    `).join('')
}

// Check if user is already logged in
async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (user) {
        currentUser = user
        showDashboard()
    } else {
        showLandingPage()
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-based animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observe all feature containers and the CTA section
document.querySelectorAll('.feature-container, .cta').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
    observer.observe(element);
});

// Handle CTA button clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        // You can replace this with your actual download link or action
        alert('Thank you for your interest! The download will start shortly.');
    });
});

// Initialize
checkAuth()

// Initialize authentication
initializeAuth() 