'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { supabase } from '../../lib/supabase';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [totalArticles, setTotalArticles] = useState<number | string>('...');
  const [totalViews, setTotalViews] = useState<number | string>('...');
  const [recentActivity, setRecentActivity] = useState<{time: string, action: string, type: string}[]>([
    { time: 'System', action: 'Connecting to database...', type: 'system' }
  ]);
  const [engineStatus, setEngineStatus] = useState('Checking...');
  const [engineSource, setEngineSource] = useState('...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      try {
        // Fetch total articles count
        const { count, error: countError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });
        if (countError) throw countError;
        setTotalArticles(count || 0);

        // Fetch bot config
        const { data: configData } = await supabase
          .from('bot_config')
          .select('*')
          .eq('id', 'default')
          .single();

        if (configData) {
          setEngineStatus(configData.isActive ? 'Active Schedule' : 'Idle / Ready');
          setEngineSource(configData.verticals ? configData.verticals.join(', ') : 'No sources configured');
        } else {
          setEngineStatus('Idle / Ready');
          setEngineSource('techcrunch.com');
        }
        
        // Fetch recent articles for views and activities
        const { data: recentArticles } = await supabase
          .from('articles')
          .select('*')
          .order('publishedAt', { ascending: false })
          .limit(50);

        let views = 0;
        const activities: {time: string, action: string, type: string}[] = [];
        
        if (recentArticles && recentArticles.length > 0) {
          recentArticles.forEach(data => {
            views += (data.views || 0);
            
            if (activities.length < 5) {
              const pubTime = data.publishedAt ? new Date(data.publishedAt).getTime() : new Date().getTime();
              const timeDiff = new Date().getTime() - pubTime;
              const hours = Math.floor(timeDiff / (1000 * 60 * 60));
              const timeStr = hours === 0 ? 'Recently' : `${hours} hours ago`;
              
              activities.push({
                time: timeStr,
                action: `Published article "${data.title.substring(0, 40)}..."`,
                type: 'publish'
              });
            }
          });
        }
        
        setTotalViews(views);
        
        if (activities.length === 0) {
           setRecentActivity([
             { time: 'System', action: 'Bot Engine standing by, waiting for first run', type: 'system' }
           ]);
        } else {
           setRecentActivity(activities);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setTotalArticles(0);
        setTotalViews(0);
      }
    };
    
    fetchStats();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const cleanEmail = email.trim();
      console.log('Attempting login with:', cleanEmail);
      console.log('API Key in use:', auth.app.options.apiKey!.substring(0, 5) + '...');
      if (!auth.app.options.apiKey || auth.app.options.apiKey === 'dummy_api_key') {
        console.error('Firebase API key is missing or dummy! Check .env.local');
      }
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      console.log('Login successful');
    } catch (err: unknown) {
      const error = err as Error & { code?: string };
      console.error('Login error code:', error.code);
      console.error('Login error message:', error.message);
      setError(error.message || 'Invalid credentials');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className={styles.authContainer}>Loading authentication...</div>;
  }

  if (!user) {
    return (
      <div className={styles.authContainer}>
        <div className={`glass-panel ${styles.authModal}`}>
          <h1 className={styles.authTitle}>Editorial Dashboard Login</h1>
          {error && <div className={styles.errorBox}>{error}</div>}
          <form onSubmit={handleLogin} className={styles.authForm}>
            <div>
              <label className={styles.inputLabel}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                placeholder="admin@nexusinsights.com"
                required
              />
            </div>
            <div>
              <label className={styles.inputLabel}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                placeholder="admin"
                required
              />
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Technify CMS</h2>
          <span className={styles.sidebarSubtitle}>Editorial Workspace</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLinkActive}>
            📊 Overview
          </Link>
          <Link href="/admin/articles" className={styles.navLink}>
            📝 Articles
          </Link>
          <Link href="/admin/bot" className={styles.navLink}>
            🤖 Editorial Engine
          </Link>
          <Link href="/" className={styles.backLink}>
            🌐 Back to Site
          </Link>
        </nav>
        
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Welcome to the Dashboard 👋</h1>
            <p className={styles.headerSubtitle}>Here is a summary of platform performance today.</p>
          </div>
          <Link href="/admin/articles/new" className="btn btn-primary">
            + New Article (Manual)
          </Link>
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3 className={styles.statTitle}>Total Articles</h3>
            <div className={styles.statValue}>{totalArticles}</div>
            <div className={styles.statTrend}>Live Data</div>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3 className={styles.statTitle}>Views (Total)</h3>
            <div className={styles.statValue}>{typeof totalViews === 'number' ? totalViews.toLocaleString() : totalViews}</div>
            <div className={styles.statTrend}>Live Data</div>
          </div>
          <div className={`glass-panel ${styles.engineCard}`}>
            <h3 className={styles.statTitle}>Engine Status</h3>
            <div className={styles.engineStatus}>{engineStatus}</div>
            <div className={styles.engineData}>Sources: {engineSource}</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`glass-panel ${styles.activityContainer}`}>
          <h2 className={styles.activityTitle}>Recent Editorial Activity</h2>
          <div className={styles.activityList}>
            {recentActivity.map((log, i) => (
              <div key={i} className={styles.activityItem}>
                <div 
                  className={`${styles.activityDot} ${
                    log.type === 'publish' ? styles.dotPublish : 
                    log.type === 'scrape' ? styles.dotScrape : 
                    log.type === 'rewrite' ? styles.dotRewrite : 
                    styles.dotSystem
                  }`}
                ></div>
                <div className={styles.activityAction}>{log.action}</div>
                <div className={styles.activityTime}>{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
