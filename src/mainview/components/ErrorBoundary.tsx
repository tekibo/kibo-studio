import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            return (
                <div className="flex h-screen items-center justify-center bg-background p-4">
                    <div className="mx-auto max-w-[480px] text-center">
                        <p className="mb-3 text-sm font-semibold text-destructive">Something went wrong</p>
                        <pre className="mb-4 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted p-3 text-left text-xs text-muted-foreground">
                            {this.state.error.message}<br/><br/>{this.state.error.stack}
                        </pre>
                        <button onClick={() => { this.setState({ error: null }); window.location.reload(); }}
                            className="cursor-pointer rounded-md border-none bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                            Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
