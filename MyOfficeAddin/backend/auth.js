const { createClient } = require('@supabase/supabase-js');
const express = require('express');

const router = express.Router();

const supabaseUrl = 'https://fqcwxjeklbufunjfqkix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxY3d4amVrbGJ1ZnVuamZxa2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTk5NDYsImV4cCI6MjA1NzgzNTk0Nn0.ZfkJ9AE2wrIDkMJu9WdqRwawMEjRydz1WCCEnP8EVFI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sign up endpoint
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        email: email,
                        name: name
                    }
                ]);

            if (profileError) throw profileError;
        }

        res.json({ data, error: null });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message });
    }
});

// Initialize credits endpoint
router.post('/initialize-credits', async (req, res) => {
    try {
        const { userId, initialCredits } = req.body;
        
        const { error } = await supabase
            .from('user_credits')
            .insert([
                {
                    user_id: userId,
                    credits: initialCredits
                }
            ]);

        if (error) throw error;

        res.json({ error: null });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Sign in endpoint
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // Get user credits
        const { data: creditsData, error: creditsError } = await supabase
            .from('user_credits')
            .select('credits')
            .eq('user_id', data.user.id)
            .single();

        if (creditsError) throw creditsError;

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        res.json({ 
            data: { 
                user: data.user,
                profile: profileData,
                credits: creditsData.credits
            }, 
            error: null 
        });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message });
    }
});

// Sign out endpoint
router.post('/signout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        res.json({ error: null });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 