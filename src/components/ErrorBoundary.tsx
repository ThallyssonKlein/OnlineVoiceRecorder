'use client'

import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { logger } from '@services/logger'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(`[ErrorBoundary] render failed: ${errorInfo.componentStack}`, error)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div role="alert" className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-gray-800">Something went wrong. Please try again.</p>
        <button
          type="button"
          onClick={this.handleRetry}
          className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
        >
          Try again
        </button>
      </div>
    )
  }
}
