// @ts-nocheck
'use client';

import React, { useEffect, useRef, useState } from 'react';
import './MathInput.css';

interface MathInputProps {
  value: string;
  onChange: (latex: string) => void;
  placeholder?: string;
}

const MathInput: React.FC<MathInputProps> = ({ value, onChange, placeholder = 'Enter math expression...' }) => {
  const mathFieldRef = useRef<HTMLDivElement>(null);
  const mathFieldInstance = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Dynamically load jQuery and MathQuill
    const initMathQuill = () => {
      if (typeof window === 'undefined') return;

      // Check if already initialized
      if ((window as any).MathQuill && mathFieldRef.current && !mathFieldInstance.current) {
        initializeMathField();
        return;
      }

      // Load CSS first
      if (!document.querySelector('link[href*="mathquill.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@edtr-io/mathquill@0.11.0/build/mathquill.css';
        document.head.appendChild(link);
      }

      // Load jQuery first (MathQuill depends on it)
      if (!(window as any).jQuery) {
        if (!document.querySelector('script[src*="jquery"]')) {
          const jqueryScript = document.createElement('script');
          jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
          jqueryScript.async = false; // Load synchronously to ensure order
          jqueryScript.onload = () => {
            console.log('jQuery loaded, version:', (window as any).jQuery.fn.jquery);
            // Wait a bit to ensure jQuery is fully available
            setTimeout(() => {
              loadMathQuill();
            }, 50);
          };
          jqueryScript.onerror = () => {
            console.error('Failed to load jQuery');
          };
          document.head.appendChild(jqueryScript);
        } else {
          // jQuery script tag exists, wait for it to load
          const checkJQuery = setInterval(() => {
            if ((window as any).jQuery) {
              clearInterval(checkJQuery);
              console.log('jQuery already loaded, version:', (window as any).jQuery.fn.jquery);
              loadMathQuill();
            }
          }, 100);
        }
      } else {
        console.log('jQuery already available, version:', (window as any).jQuery.fn.jquery);
        loadMathQuill();
      }
    };

    const loadMathQuill = () => {
      // Verify jQuery is loaded
      if (!(window as any).jQuery) {
        console.error('Cannot load MathQuill: jQuery not loaded');
        return;
      }

      if ((window as any).MathQuill) {
        console.log('MathQuill already available');
        initializeMathField();
        return;
      }

      if (!document.querySelector('script[src*="mathquill"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@edtr-io/mathquill@0.11.0/build/mathquill.min.js';
        script.async = false; // Load synchronously to ensure it has access to jQuery
        script.onload = () => {
          console.log('MathQuill script loaded');
          // Wait for MathQuill to be available
          const checkMQ = setInterval(() => {
            if ((window as any).MathQuill) {
              clearInterval(checkMQ);
              console.log('MathQuill is now available');
              initializeMathField();
            }
          }, 50);
        };
        script.onerror = () => {
          console.error('Failed to load MathQuill');
        };
        document.head.appendChild(script);
      } else {
        // MathQuill script exists, wait for it to load
        const checkMQ = setInterval(() => {
          if ((window as any).MathQuill) {
            clearInterval(checkMQ);
            console.log('MathQuill became available');
            initializeMathField();
          }
        }, 50);
      }
    };

    const initializeMathField = () => {
      if (!mathFieldRef.current || mathFieldInstance.current) return;

      const MathQuill = (window as any).MathQuill;
      if (!MathQuill) {
        console.error('MathQuill not available');
        return;
      }

      try {
        console.log('Initializing MathField');
        const MQ = MathQuill.getInterface(2);
        const mathField = MQ.MathField(mathFieldRef.current, {
          spaceBehavesLikeTab: true,
          handlers: {
            edit: function() {
              const latex = mathField.latex();
              console.log('LaTeX changed:', latex);
              onChange(latex);
            }
          }
        });

        mathFieldInstance.current = mathField;

        // Set initial value if provided
        if (value) {
          mathField.latex(value);
        }

        // Focus the field to make it ready for input
        mathField.focus();

        setIsReady(true);
        console.log('MathField initialized successfully');
      } catch (error) {
        console.error('Error creating MathField:', error);
      }
    };

    initMathQuill();

    return () => {
      // Cleanup
      if (mathFieldInstance.current) {
        mathFieldInstance.current = null;
      }
    };
  }, []);

  // Update value when prop changes
  useEffect(() => {
    if (mathFieldInstance.current && value !== mathFieldInstance.current.latex()) {
      mathFieldInstance.current.latex(value);
    }
  }, [value]);

  const insertSymbol = (latex: string) => {
    if (mathFieldInstance.current) {
      mathFieldInstance.current.cmd(latex);
      mathFieldInstance.current.focus();
    }
  };

  const insertText = (text: string) => {
    if (mathFieldInstance.current) {
      mathFieldInstance.current.write(text);
      mathFieldInstance.current.focus();
    }
  };

  const mathButtons = [
    { label: 'x²', latex: '^2', type: 'cmd' },
    { label: 'x³', latex: '^3', type: 'cmd' },
    { label: 'xⁿ', latex: '^', type: 'cmd' },
    { label: '√', latex: '\\sqrt', type: 'cmd' },
    { label: '∛', latex: '\\sqrt[3]{}', type: 'write' },
    { label: 'ⁿ√', latex: '\\nthroot', type: 'cmd' },
    { label: '±', latex: '\\pm', type: 'cmd' },
    { label: '÷', latex: '\\div', type: 'cmd' },
    { label: '×', latex: '\\times', type: 'cmd' },
    { label: 'a/b', latex: '/', type: 'cmd' },
    { label: '≤', latex: '\\le', type: 'cmd' },
    { label: '≥', latex: '\\ge', type: 'cmd' },
    { label: '≠', latex: '\\ne', type: 'cmd' },
    { label: '∞', latex: '\\infty', type: 'cmd' },
    { label: 'π', latex: '\\pi', type: 'cmd' },
    { label: 'α', latex: '\\alpha', type: 'cmd' },
    { label: 'β', latex: '\\beta', type: 'cmd' },
    { label: 'θ', latex: '\\theta', type: 'cmd' },
    { label: 'Σ', latex: '\\sum', type: 'cmd' },
    { label: '∫', latex: '\\int', type: 'cmd' },
    { label: 'lim', latex: '\\lim', type: 'cmd' },
    { label: '( )', latex: '()', type: 'write' },
    { label: '[ ]', latex: '[]', type: 'write' },
    { label: '{ }', latex: '\\{\\}', type: 'write' },
  ];

  const handleFieldClick = () => {
    if (mathFieldInstance.current) {
      mathFieldInstance.current.focus();
    }
  };

  return (
    <div className="math-input-container">
      {/* MathQuill Input Field */}
      <div className="math-input-wrapper">
        <label className="math-input-label">Your Answer:</label>
        <div
          ref={mathFieldRef}
          className="math-input-field"
          data-placeholder={placeholder}
          onClick={handleFieldClick}
        />
      </div>

      {/* Math Keyboard */}
      <div className="math-keyboard">
        <div className="math-keyboard-label">Insert symbol:</div>
        <div className="math-keyboard-buttons">
          {mathButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="math-button"
              onClick={() => {
                if (button.type === 'cmd') {
                  insertSymbol(button.latex);
                } else {
                  insertText(button.latex);
                }
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathInput;
