/**
 * CopyButton — small icon button that copies text to clipboard.
 * Companion to DetailField.
 */
import { useState, type ReactNode, type MouseEvent } from 'react';

export interface CopyButtonProps {
  text: string;
  label?: ReactNode;
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      aria-label={label as string}
      title={copied ? 'Copied!' : (label as string)}
      onClick={handleCopy}
      className="cs-copy-button"
    >
      {copied ? '✓' : '⧉'}
    </button>
  );
}

export default CopyButton;
