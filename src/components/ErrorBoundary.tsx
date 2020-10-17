import React, { Component } from 'react'

interface IProps {}

interface IState {
  hasError: boolean
}

class ErrorBoundary extends Component<IProps, IState> {
  state: Readonly<IState> = {
    hasError: false,
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log(error, errorInfo)
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props
    if (hasError) {
      return <h1>Something went wrong.</h1>
    }

    return children
  }
}

export { ErrorBoundary }
