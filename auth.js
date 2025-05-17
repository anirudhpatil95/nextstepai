import { SUPABASE_CONFIG } from './config.js';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Auth state management
let currentUser = null;

// Event listeners for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        updateUIForAuthState(true);
        showMessage('Successfully signed in!');
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateUIForAuthState(false);
        showMessage('Successfully signed out!');
    }
});

// Sign up function
export async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });

        if (error) throw error;

        return {
            success: true,
            message: 'Please check your email for the verification link!',
            data
        };
    } catch (error) {
        console.error('Sign up error:', error);
        return {
            success: false,
            message: error.message,
            error
        };
    }
}

// Sign in function
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        return {
            success: true,
            message: 'Successfully signed in!',
            data
        };
    } catch (error) {
        console.error('Sign in error:', error);
        return {
            success: false,
            message: error.message,
            error
        };
    }
}

// Sign out function
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return {
            success: true,
            message: 'Successfully signed out!'
        };
    } catch (error) {
        console.error('Sign out error:', error);
        return {
            success: false,
            message: error.message,
            error
        };
    }
}

// Get current session
export async function getCurrentSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
}

// Helper function to update UI based on auth state
function updateUIForAuthState(isAuthenticated) {
    const mainContent = document.getElementById('mainContent');
    const dashboard = document.getElementById('dashboard');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const navSignupBtn = document.getElementById('navSignupBtn');

    if (isAuthenticated) {
        mainContent.style.display = 'none';
        dashboard.classList.add('active');
        loginBtn.style.display = 'none';
        navSignupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        mainContent.style.display = 'block';
        dashboard.classList.remove('active');
        loginBtn.style.display = 'block';
        navSignupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Helper function to show messages
function showMessage(message) {
    alert(message);
}

// Initialize auth state
export async function initializeAuth() {
    const session = await getCurrentSession();
    if (session) {
        currentUser = session.user;
        updateUIForAuthState(true);
    } else {
        updateUIForAuthState(false);
    }
}

// Export Supabase client for other modules
export { supabase, currentUser }; 