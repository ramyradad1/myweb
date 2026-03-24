'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { supabase } from '../../../lib/supabase';
import styles from '../admin.module.css';

interface BotConfig {
  aiModel: string;
  editorialTone: string;
  editorialDepth: number;
  autoTranslate: boolean;
  verticals: string[];
  dailyTarget: number;
  scheduleFormat: string;
  isActive: boolean;
}

const defaultConfig: BotConfig = {
  aiModel: 'gemini-2.5-flash',
  editorialTone: 'Professional',
  editorialDepth: 85,
  autoTranslate: true,
  verticals: ['techcrunch.com', 'theverge.com', 'wired.com', 'mashable.com'],
  dailyTarget: 5,
  scheduleFormat: 'Drip Publishing - Better for SEO consistency',
  isActive: false,
};

export default function AdminBotControl() {
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<BotConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthed(true);
        loadConfig();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_config')
        .select('*')
        .eq('id', 'default')
        .single();
      if (error) throw error;
      if (data) {
        setConfig(prev => ({ ...prev, ...data as BotConfig }));
      }
    } catch (err) {
      console.error('Failed to load bot config:', err);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    setSaveMsg('');
    try {
      const { error } = await supabase
        .from('bot_config')
        .upsert({ id: 'default', ...config });
      if (error) throw error;
        
      setSaveMsg('Configuration saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save config:', err);
      setSaveMsg('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveSchedule = async () => {
    setIsSaving(true);
    setSaveMsg('');
    try {
      const { error } = await supabase
        .from('bot_config')
        .upsert({
          id: 'default',
          dailyTarget: config.dailyTarget,
          scheduleFormat: config.scheduleFormat,
        });
      if (error) throw error;
        
      setSaveMsg('Schedule updated!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save schedule:', err);
      setSaveMsg('Failed to save schedule.');
    } finally {
      setIsSaving(false);
    }
  };

  const addVertical = () => {
    const url = prompt('Enter the domain of the new source (e.g. arstechnica.com):');
    if (url && url.trim()) {
      const cleaned = url.trim().toLowerCase().replace(/^(https?:\/\/)?/i, '').replace(/\/.*$/, '');
      if (!config.verticals.includes(cleaned)) {
        setConfig(prev => ({ ...prev, verticals: [...prev.verticals, cleaned] }));
      }
    }
  };

  const removeVertical = (v: string) => {
    setConfig(prev => ({ ...prev, verticals: prev.verticals.filter(s => s !== v) }));
  };

  const startEngine = async () => {
    try {
      setIsRunning(true);
      const res = await fetch('/api/cron/bot');
      const data = await res.json();
      console.log('Bot Response:', data);
      alert(data.message || 'Engine cycle complete!');
    } catch (err) {
      console.error('Failed to start engine:', err);
      alert('Failed to start engine.');
    } finally {
      setIsRunning(false);
    }
  };

  if (!authed) {
    return <div className={styles.adminContainer}><div className={`${styles.mainContent} ${styles.centerLoading}`}>Authenticating...</div></div>;
  }
  
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Technify CMS</h2>
          <span className={styles.sidebarSubtitle}>Editorial Workspace</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            📊 Overview
          </Link>
          <Link href="/admin/articles" className={styles.navLink}>
            📝 Articles
          </Link>
          <Link href="/admin/bot" className={styles.navLinkActive}>
            🤖 Editorial Engine
          </Link>
          <Link href="/" className={styles.backLink}>
            🌐 Back to Site
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Editorial Engine Control</h1>
            <p className={styles.headerSubtitle}>Manage content sourcing, AI synthesis settings, and automated distribution.</p>
          </div>
          <button 
            className={`btn ${isRunning ? styles.btnStop : styles.btnStart}`}
            onClick={startEngine}
            title={isRunning ? "Stop Engine" : "Start Engine"}
          >
            {isRunning ? '⏹ Running...' : '▶ Start Engine'}
          </button>
        </header>

        {saveMsg && (
          <div className={`${styles.saveMessage} ${saveMsg.includes('Failed') ? styles.saveMessageError : styles.saveMessageSuccess}`}>
            {saveMsg}
          </div>
        )}

        <div className={styles.botGrid}>
          
          {/* Sources Panel */}
          <div className={`glass-panel ${styles.botPanel}`}>
            <div className={styles.botPanelHeader}>
              <h2 className={styles.tableTitle}>Content Verticals (Sources)</h2>
              <button className={styles.addBtn} title="Add Vertical" onClick={addVertical}>+ Add</button>
            </div>
            
            <ul className={styles.sourceList}>
              {config.verticals.map((src, i) => (
                <li key={i} className={styles.sourceItem}>
                  <span>{src}</span>
                  <div className={styles.sourceActionContainer}>
                    <span className={styles.sourceActive}>Active</span>
                    <button 
                      onClick={() => removeVertical(src)} 
                      className={styles.sourceAction}
                      title={`Remove ${src}`}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Settings Panel */}
          <div className={`glass-panel ${styles.botPanel}`}>
            <h2 className={styles.botPanelTitle}>Synthesis Configuration (AI)</h2>
            
            <form className={styles.formGroup} onSubmit={(e) => { e.preventDefault(); saveConfig(); }}>
              <div>
                <label htmlFor="aiModel" className={styles.inputLabel}>AI Model</label>
                <select 
                  id="aiModel" 
                  title="AI Model Selection" 
                  className={styles.selectField}
                  value={config.aiModel}
                  onChange={e => setConfig(prev => ({...prev, aiModel: e.target.value}))}
                >
                  <option value="gemini-2.5-flash">Google Gemini 2.5 Flash</option>
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                </select>
              </div>

              <div>
                <label htmlFor="editorialTone" className={styles.inputLabel}>Editorial Tone</label>
                <select 
                  id="editorialTone" 
                  title="Editorial Tone Selection" 
                  className={styles.selectField}
                  value={config.editorialTone}
                  onChange={e => setConfig(prev => ({...prev, editorialTone: e.target.value}))}
                >
                  <option>Professional</option>
                  <option>Journalistic</option>
                  <option>Engaging</option>
                  <option>Academic</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="editorialDepth" className={styles.inputLabel}>Editorial Depth (Aggregation vs Synthesis)</label>
                <input 
                  id="editorialDepth" 
                  title="Editorial Depth" 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={config.editorialDepth}
                  onChange={e => setConfig(prev => ({...prev, editorialDepth: Number(e.target.value)}))}
                  className={`${styles.rangeInput} ${styles.wFull}`} 
                />
                <div className={styles.rangeContainer}>
                  <span>Light Aggregation</span>
                  <span>Balanced</span>
                  <span>Deep Synthesis</span>
                </div>
              </div>

              <div>
                <label htmlFor="outputLanguage" className={styles.inputLabel}>Article Output Language</label>
                <select 
                  id="outputLanguage" 
                  title="Output Language Selection" 
                  className={styles.selectField}
                  value={config.autoTranslate ? 'Arabic' : 'English'}
                  onChange={e => setConfig(prev => ({...prev, autoTranslate: e.target.value === 'Arabic'}))}
                >
                  <option value="English">English (US)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                </select>
                <p className={styles.helpText} style={{marginBottom: "1.5rem"}}>Gemini will automatically translate scraped content from any source language exclusively to this selected language.</p>
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary ${styles.wFull}`} 
                title="Save Configuration"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </form>
          </div>

          {/* Scheduler Panel */}
          <div className={`glass-panel ${styles.fullPanel}`}>
            <h2 className={styles.botPanelTitle}>Distribution Schedule</h2>
            
            <div className={styles.scheduleGrid}>
              <div className={styles.scheduleCol}>
                <label htmlFor="publishTarget" className={styles.inputLabel}>Daily Publication Target</label>
                <input 
                  id="publishTarget" 
                  title="Daily Publication Target" 
                  type="number" 
                  value={config.dailyTarget}
                  onChange={e => setConfig(prev => ({...prev, dailyTarget: Number(e.target.value)}))}
                  className={styles.inputField} 
                />
                <p className={styles.helpText}>Target number of insights to publish daily across all verticals.</p>
              </div>
              
              <div className={styles.scheduleCol}>
                <label htmlFor="scheduleFormat" className={styles.inputLabel}>Schedule Format</label>
                <select 
                  id="scheduleFormat" 
                  title="Schedule Format Selection" 
                  className={styles.selectField}
                  value={config.scheduleFormat}
                  onChange={e => setConfig(prev => ({...prev, scheduleFormat: e.target.value}))}
                >
                  <option>Drip Publishing - Better for SEO consistency</option>
                  <option>Morning Batch</option>
                  <option>Evening Batch</option>
                </select>
              </div>
              
              <div className={styles.scheduleColFull}>
                <button 
                  type="button" 
                  className={styles.btnOutline} 
                  title="Update Schedule"
                  onClick={saveSchedule}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Update Schedule'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
