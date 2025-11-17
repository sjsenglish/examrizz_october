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
    // Dynamically load MathQuill only on client side
    const initMathQuill = () => {
      if (typeof window === 'undefined') return;

      try {
        // Check if MathQuill is already loaded
        if ((window as any).MathQuill && mathFieldRef.current && !mathFieldInstance.current) {
          initializeMathField();
          return;
        }

        // Load MathQuill CSS
        if (!document.querySelector('link[href*="mathquill.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/@edtr-io/mathquill@0.11.0/build/mathquill.css';
          document.head.appendChild(link);
        }

        // Load MathQuill JS
        if (!document.querySelector('script[src*="mathquill.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@edtr-io/mathquill@0.11.0/build/mathquill.min.js';
          script.async = true;
          script.onload = () => {
            // Wait a bit for MathQuill to be available
            setTimeout(() => {
              if (mathFieldRef.current && !mathFieldInstance.current) {
                initializeMathField();
              }
            }, 100);
          };
          script.onerror = () => {
            console.error('Failed to load MathQuill script');
          };
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error initializing MathQuill:', error);
      }
    };

    const initializeMathField = () => {
      try {
        const MathQuill = (window as any).MathQuill;
        if (!MathQuill || !mathFieldRef.current) return;

        const mathField = MathQuill.getInterface(2).MathField(mathFieldRef.current, {
          spaceBehavesLikeTab: true,
          leftRightIntoCmdGoes: 'up',
          restrictMismatchedBrackets: true,
          sumStartsWithNEquals: true,
          supSubsRequireOperand: true,
          charsThatBreakOutOfSupSub: '+-=<>',
          autoSubscriptNumerals: true,
          handlers: {
            edit: function() {
              const latex = mathField.latex();
              onChange(latex);
            }
          }
        });

        mathFieldInstance.current = mathField;

        // Set initial value if provided
        if (value) {
          mathField.latex(value);
        }

        setIsReady(true);
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
