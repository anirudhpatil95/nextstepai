// Initialize Supabase client
const supabaseUrl = 'https://gdvnhzibynjanakeofef.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkdm5oemlieW5qYW5ha2VvZmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODYzNjMsImV4cCI6MjA2MzA2MjM2M30.ruppN5sB-IK-Ch-o_8FR7Tb4rSt0-h3sygV_vpMmjyo'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

// DOM Elements
const loginBtn = document.getElementById('loginBtn')
const signupBtn = document.getElementById('signupBtn')
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

// State
let selectedPlatforms = new Set()
let currentUser = null

// Auth Modal Handlers
loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    loginModal.classList.add('active')
})

signupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    signupModal.classList.add('active')
})

// Close modal buttons
closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('active')
})

closeSignupBtn.addEventListener('click', () => {
    signupModal.classList.remove('active')
})

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active')
    }
    if (e.target === signupModal) {
        signupModal.classList.remove('active')
    }
})

// Auth Form Handlers
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error

        currentUser = data.user
        loginModal.classList.remove('active')
        showDashboard()
        authError.textContent = ''
    } catch (error) {
        authError.textContent = 'Error logging in: ' + error.message
    }
})

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('signupEmail').value
    const password = document.getElementById('signupPassword').value

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) throw error

        signupModal.classList.remove('active')
        authError.textContent = 'Check your email for verification link!'
    } catch (error) {
        authError.textContent = 'Error signing up: ' + error.message
    }
})

// Logout handler
logoutBtn.addEventListener('click', async () => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        currentUser = null
        showLandingPage()
    } catch (error) {
        console.error('Error logging out:', error)
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

    const formData = {
        businessName: document.getElementById('businessName').value,
        contentGoal: document.getElementById('contentGoal').value,
        contentVibe: document.getElementById('contentVibe').value,
        platforms: Array.from(selectedPlatforms)
    }

    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            signupModal.classList.add('active')
            return
        }

        // Generate content for each platform
        const generatedContents = await Promise.all(
            formData.platforms.map(async platform => {
                const { data, error } = await supabase.functions.invoke('generate-content', {
                    body: {
                        ...formData,
                        platform,
                        userId: user.id
                    }
                })

                if (error) throw error
                return { platform, content: data }
            })
        )

        // Display generated content
        displayGeneratedContent(generatedContents)

        // Store in Supabase
        await supabase.from('generated_content').insert(
            generatedContents.map(({ platform, content }) => ({
                user_id: user.id,
                platform,
                content,
                business_name: formData.businessName,
                content_goal: formData.contentGoal,
                content_vibe: formData.contentVibe
            }))
        )

        // Send email notification
        await supabase.functions.invoke('send-email-notification', {
            body: {
                userId: user.id,
                contents: generatedContents
            }
        })

    } catch (error) {
        alert('Error generating content: ' + error.message)
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
    const { data: { user } } = await supabase.auth.getUser()
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
