'use client';

import React, { useState, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null
  });

  useEffect(() => {
    // 添加全局错误处理
    const handleError = (event: ErrorEvent) => {
      console.error('捕获到渲染错误:', event.error);
      setState({
        hasError: true,
        error: event.error
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (state.hasError) {
    return (
      <div className="error-container" style={{ padding: '20px', margin: '20px', border: '1px solid red' }}>
        <h2>页面加载出现问题</h2>
        <p>我们正在努力修复这个问题。请稍后再试。</p>
        <button 
          onClick={() => {
            setState({ hasError: false, error: null });
            window.location.reload();
          }}
          style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          重试
        </button>
        {state.error && (
          <pre style={{ marginTop: '20px', padding: '10px', background: '#f7f7f7' }}>
            {state.error.toString()}
          </pre>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

// 类组件版本的错误边界，用于捕获子组件中的错误
export class ClassErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('组件错误:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-container" style={{ padding: '20px', margin: '20px', border: '1px solid red' }}>
          <h2>组件渲染出现问题</h2>
          <p>我们正在努力修复这个问题。请稍后再试。</p>
          <button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            重试
          </button>
          {this.state.error && (
            <pre style={{ marginTop: '20px', padding: '10px', background: '#f7f7f7' }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
