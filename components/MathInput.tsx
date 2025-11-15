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
    // Dynamically import MathQuill only on client side
    const initMathQuill = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Import MathQuill CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@edtr-io/mathquill@0.10.1-4/build/mathquill.css';
        document.head.appendChild(link);

        // Import MathQuill library
        const MQ = await import('@edtr-io/mathquill');
        const MathQuill = MQ.default || MQ;

        if (mathFieldRef.current && !mathFieldInstance.current) {
          const mathField = MathQuill.getInterface(2).MathField(mathFieldRef.current, {
            spaceBehavesLikeTab: true,
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
        }
      } catch (error) {
        console.error('Error initializing MathQuill:', error);
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

  return (
    <div className="math-input-container">
      {/* LaTeX Preview */}
      <div className="math-preview">
        <div className="math-preview-label">Preview:</div>
        <div className="math-preview-content">
          {value ? (
            <div ref={(el) => {
              if (el && isReady) {
                el.textContent = '';
                try {
                  const MQ = (window as any).MathQuill;
                  if (MQ) {
                    MQ.getInterface(2).StaticMath(el).latex(value);
                  }
                } catch (e) {
                  el.textContent = value;
                }
              }
            }} />
          ) : (
            <span className="math-preview-placeholder">Math preview will appear here</span>
          )}
        </div>
      </div>

      {/* MathQuill Input Field */}
      <div className="math-input-wrapper">
        <div
          ref={mathFieldRef}
          className="math-input-field"
          data-placeholder={placeholder}
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
