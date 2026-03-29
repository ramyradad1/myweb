'use client';

import { useEffect, useRef } from 'react';
import styles from '@/app/articles/[slug]/page.module.css';

export default function CopyableArticleBody({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    // Select all pre blocks inside the article body
    const preElements = contentRef.current.querySelectorAll('pre');
    
    preElements.forEach((pre) => {
      // Avoid adding multiple buttons on React re-renders or Strict Mode
      if (pre.querySelector('.copy-button')) return;
      
      // Ensure the pre block is relatively positioned to host the absolute button
      pre.style.position = 'relative';
      // To ensure the button doesn't overlap scrollbars, add padding-top if needed, or stick it cleanly
      pre.style.paddingTop = '2.5rem';
      
      // Create the Copy Button
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
      
      // Inline styles for the button
      Object.assign(button.style, {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        padding: '0.4rem 0.6rem',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#e2e8f0',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease',
        zIndex: '10'
      });
      
      // Hover effects
      button.onmouseover = () => {
        button.style.background = 'rgba(255, 255, 255, 0.2)';
      };
      button.onmouseout = () => {
        button.style.background = 'rgba(255, 255, 255, 0.1)';
      };
      
      // Copy action
      button.onclick = () => {
        // Find code tag or fallback to pre text (excluding button text)
        const codeElement = pre.querySelector('code');
        const codeText = codeElement ? codeElement.innerText : pre.textContent;
        // Clean text by stripping out the SVG/Copy text
        const cleanText = (codeText || '').replace(/Copy$/, '').trim();
        
        navigator.clipboard.writeText(cleanText).then(() => {
          button.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
          button.style.background = 'rgba(34, 197, 94, 0.2)';
          button.style.borderColor = 'rgba(34, 197, 94, 0.5)';
          button.style.color = '#4ade80';
          
          setTimeout(() => {
            button.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
            button.style.background = 'rgba(255, 255, 255, 0.1)';
            button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            button.style.color = '#e2e8f0';
          }, 2000);
        });
      };
      
      pre.appendChild(button);
    });
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className={styles.articleBody}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
