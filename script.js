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
const heroSignupBtn = document.getElementById('heroSignupBtn')
const navSignupBtn = document.getElementById('navSignupBtn')
const ctaSignupBtn = document.getElementById('ctaSignupBtn')
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
const loadingSpinner = document.getElementById('loadingSpinner')
const welcomeMessage = document.getElementById('welcomeMessage')

// State
let selectedPlatforms = new Set()
let currentUser = null

// Debug logging
console.log('Script loaded, checking elements:')
console.log({
    loginBtn,
    heroSignupBtn,
    navSignupBtn,
    loginModal,
    signupModal
})

// Show/Hide Loading Spinner
function showLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'flex'
}

function hideLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'none'
}

// Show/Hide Modals
function showModal(modal) {
    if (modal) {
        modal.style.display = 'flex'
        modal.classList.add('active')
    }
}

function hideModal(modal) {
    if (modal) {
        modal.style.display = 'none'
        modal.classList.remove('active')
    }
}

// Toast Messages
function showToast(message, type = 'success') {
    const toast = document.createElement('div')
    toast.className = `toast ${type}`
    toast.textContent = message
    const container = document.getElementById('toastContainer')
    if (container) {
        container.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)
    }
}

// Auth Button Click Handlers
function handleSignupClick(e) {
    console.log('Signup button clicked')
    e.preventDefault()
    hideModal(loginModal)
    showModal(signupModal)
    clearAuthErrors()
}

function handleLoginClick(e) {
    console.log('Login button clicked')
    e.preventDefault()
    hideModal(signupModal)
    showModal(loginModal)
    clearAuthErrors()
}

// Attach click handlers
if (navSignupBtn) navSignupBtn.addEventListener('click', handleSignupClick)
if (heroSignupBtn) heroSignupBtn.addEventListener('click', handleSignupClick)
if (loginBtn) loginBtn.addEventListener('click', handleLoginClick)

// Modal switch handlers
if (switchToSignupBtn) switchToSignupBtn.addEventListener('click', handleSignupClick)
if (switchToLoginBtn) switchToLoginBtn.addEventListener('click', handleLoginClick)

// Close modal handlers
function handleCloseModal(modal) {
    return (e) => {
        e.preventDefault()
        hideModal(modal)
        clearAuthErrors()
    }
}

if (closeLoginBtn) closeLoginBtn.addEventListener('click', handleCloseModal(loginModal))
if (closeSignupBtn) closeSignupBtn.addEventListener('click', handleCloseModal(signupModal))

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) hideModal(loginModal)
    if (e.target === signupModal) hideModal(signupModal)
})

function clearAuthErrors() {
    const errors = document.querySelectorAll('.error-message')
    errors.forEach(error => {
        error.textContent = ''
        error.classList.remove('visible')
    })
}

function showError(elementId, message) {
    console.log('Showing error:', elementId, message)
    const errorElement = document.getElementById(elementId)
    if (errorElement) {
        errorElement.textContent = message
        errorElement.classList.add('visible')
    }
}

// Auth Form Handlers
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        console.log('Login form submitted')
        showLoading()
        
        const email = document.getElementById('loginEmail').value.trim()
        const password = document.getElementById('loginPassword').value

        if (!email || !password) {
            hideLoading()
            showError('loginError', 'Please fill in all fields')
            return
        }

        try {
            const result = await signIn(email, password)
            console.log('Login result:', result)
            
            if (result.success) {
                hideModal(loginModal)
                clearAuthErrors()
                showToast('Successfully logged in!')
                updateUIForAuthState(true)
            } else {
                showError('loginError', result.message)
            }
        } catch (error) {
            console.error('Login error:', error)
            showError('loginError', 'An error occurred during login')
        } finally {
            hideLoading()
        }
    })
}

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        console.log('Signup form submitted')
        showLoading()
        
        const email = document.getElementById('signupEmail').value.trim()
        const password = document.getElementById('signupPassword').value

        if (!email || !password) {
            hideLoading()
            showError('signupError', 'Please fill in all fields')
            return
        }

        if (password.length < 6) {
            hideLoading()
            showError('signupError', 'Password must be at least 6 characters')
            return
        }

        try {
            const result = await signUp(email, password)
            console.log('Signup result:', result)
            
            if (result.success) {
                hideModal(signupModal)
                showToast(result.message)
                clearAuthErrors()
            } else {
                showError('signupError', result.message)
            }
        } catch (error) {
            console.error('Signup error:', error)
            showError('signupError', 'An error occurred during signup')
        } finally {
            hideLoading()
        }
    })
}

// Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        console.log('Logout clicked')
        showLoading()
        const result = await signOut()
        hideLoading()
        
        if (result.success) {
            showToast('Successfully logged out')
            updateUIForAuthState(false)
        } else {
            showToast(result.message, 'error')
        }
    })
}

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
    showLoading()

    if (selectedPlatforms.size === 0) {
        hideLoading()
        showToast('Please select at least one platform', 'error')
        return
    }

    const formData = {
        businessName: document.getElementById('businessName').value.trim(),
        contentGoal: document.getElementById('contentGoal').value,
        contentVibe: document.getElementById('contentVibe').value,
        platforms: Array.from(selectedPlatforms)
    }

    try {
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const response = await fetch('/api/generate-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`
            },
            body: JSON.stringify(formData)
        })

        if (!response.ok) throw new Error('Failed to generate content')

        const data = await response.json()
        displayGeneratedContent(data.contents)
        showToast('Content generated successfully!')
    } catch (error) {
        console.error('Content generation error:', error)
        showToast('Failed to generate content. Please try again.', 'error')
    } finally {
        hideLoading()
    }
})

// Helper Functions
function updateUIForAuthState(isAuthenticated) {
    console.log('Updating UI state:', isAuthenticated)
    
    if (isAuthenticated) {
        if (mainContent) mainContent.style.display = 'none'
        if (dashboard) dashboard.style.display = 'block'
        if (loginBtn) loginBtn.style.display = 'none'
        if (navSignupBtn) navSignupBtn.style.display = 'none'
        if (logoutBtn) logoutBtn.style.display = 'block'
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${currentUser?.email || 'User'}!`
        }
    } else {
        if (mainContent) mainContent.style.display = 'block'
        if (dashboard) dashboard.style.display = 'none'
        if (loginBtn) loginBtn.style.display = 'block'
        if (navSignupBtn) navSignupBtn.style.display = 'block'
        if (logoutBtn) logoutBtn.style.display = 'none'
        selectedPlatforms.clear()
        platformButtons.forEach(btn => btn.classList.remove('active'))
    }
}

function displayGeneratedContent(contents) {
    generatedContent.innerHTML = contents.map(({ platform, content }) => `
        <div class="content-card">
            <h4>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
            <div class="content-text">${content}</div>
        </div>
    `).join('')
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    })
})

// Add scroll-based animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
        }
    })
}, {
    threshold: 0.1
})

// Observe all feature containers and the CTA section
document.querySelectorAll('.feature-container, .cta').forEach(element => {
    element.style.opacity = '0'
    element.style.transform = 'translateY(20px)'
    element.style.transition = 'all 0.6s ease-out'
    observer.observe(element)
})

// Handle CTA button clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        // You can replace this with your actual download link or action
        alert('Thank you for your interest! The download will start shortly.')
    })
})

// Initialize
checkAuth()

// Initialize authentication
initializeAuth() 