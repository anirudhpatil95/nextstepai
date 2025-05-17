// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
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

// State
let selectedPlatforms = new Set()

// Auth Modal Handlers
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active')
})

signupBtn.addEventListener('click', () => {
    signupModal.classList.add('active')
})

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === signupModal) {
        loginModal.classList.remove('active')
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

        loginModal.classList.remove('active')
        showDashboard()
    } catch (error) {
        alert('Error logging in: ' + error.message)
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
        alert('Check your email for verification link!')
    } catch (error) {
        alert('Error signing up: ' + error.message)
    }
})

// Platform Selection
platformButtons.forEach(button => {
    button.addEventListener('click', () => {
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
        
        if (!user) throw new Error('User not authenticated')

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
    loginBtn.textContent = 'Logout'
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
        showDashboard()
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