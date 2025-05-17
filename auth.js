import { SUPABASE_CONFIG } from './config.js';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Auth state management
let currentUser = null;

// Event listeners for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        updateUIForAuthState(true);
        updateUserProfile(session.user);
        showMessage('Successfully signed in!');
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateUIForAuthState(false);
        showMessage('Successfully signed out!');
    } else if (event === 'USER_UPDATED') {
        currentUser = session.user;
        updateUIForAuthState(true);
        updateUserProfile(session.user);
    }
});

// Sign up function
export async function signUp(email, password) {
    console.log('Attempting signup for:', email);
    try {
        // First, check if user already exists
        const { data: existingUsers } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('email', email);

        if (existingUsers && existingUsers.length > 0) {
            return {
                success: false,
                message: 'An account with this email already exists'
            };
        }

        // Proceed with signup
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin,
                data: {
                    email: email,
                }
            }
        });

        if (error) throw error;

        // Create user profile in our database
        if (data.user) {
            const { error: profileError } = await supabase
                .from('user_profiles')
                .insert([
                    {
                        user_id: data.user.id,
                        email: email,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (profileError) {
                console.error('Error creating user profile:', profileError);
            }
        }

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
    console.log('Attempting signin for:', email);
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Update last login timestamp
        if (data.user) {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({ last_login: new Date().toISOString() })
                .eq('user_id', data.user.id);

            if (updateError) {
                console.error('Error updating last login:', updateError);
            }
        }

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
    const userEmail = document.getElementById('userEmail');

    if (isAuthenticated && currentUser) {
        mainContent.style.display = 'none';
        dashboard.classList.add('active');
        loginBtn.style.display = 'none';
        navSignupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        userEmail.textContent = currentUser.email;
        userEmail.style.display = 'inline';
    } else {
        mainContent.style.display = 'block';
        dashboard.classList.remove('active');
        loginBtn.style.display = 'block';
        navSignupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        userEmail.style.display = 'none';
    }
}

// Helper function to update user profile
async function updateUserProfile(user) {
    if (!user) return;

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) throw error;

        if (!data) {
            // Create profile if it doesn't exist
            const { error: insertError } = await supabase
                .from('user_profiles')
                .insert([
                    {
                        user_id: user.id,
                        email: user.email,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (insertError) throw insertError;
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
    }
}

// Helper function to show messages
function showMessage(message) {
    alert(message);
}

// Initialize auth state
export async function initializeAuth() {
    console.log('Initializing auth...');
    const session = await getCurrentSession();
    if (session) {
        currentUser = session.user;
        updateUIForAuthState(true);
        updateUserProfile(session.user);
    } else {
        updateUIForAuthState(false);
    }
}

// Export Supabase client for other modules
export { supabase, currentUser }; 