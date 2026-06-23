import { Component, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface PortalErrorBoundaryProps {
  children: ReactNode;
}

interface PortalErrorBoundaryState {
  hasError: boolean;
}

export class PortalErrorBoundary extends Component<
  PortalErrorBoundaryProps,
  PortalErrorBoundaryState
> {
  state: PortalErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PortalErrorBoundaryState {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <PortalErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

function PortalErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="portal-error-boundary" role="alert">
      <h1>{t('shared.errorBoundary.title')}</h1>
      <p>{t('shared.errorBoundary.description')}</p>
      <button type="button" onClick={onRetry}>
        {t('shared.errorBoundary.retry')}
      </button>
    </div>
  );
}
