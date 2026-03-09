"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-8 bg-slate-50 text-slate-900">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-600 mb-4 max-w-md text-center">
            {this.state.error?.message ?? "An error occurred loading this page."}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-3 py-2 rounded-lg text-sm bg-teal-600 text-white hover:bg-teal-700"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-sm bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
