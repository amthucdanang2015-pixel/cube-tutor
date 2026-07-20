/**
 * Copy text from a user gesture without assuming the async Clipboard API is
 * available. The textarea path keeps older browsers and non-secure local
 * contexts useful while restoring the user's focus and selection afterwards.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission and secure-context failures can still use the legacy path.
    }
  }

  return copyWithTextarea(text);
}

function copyWithTextarea(text: string): boolean {
  if (
    typeof document === "undefined" ||
    !document.body ||
    typeof document.execCommand !== "function"
  ) {
    return false;
  }

  const activeElement = document.activeElement as HTMLElement | null;
  const activeInput =
    activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement
      ? activeElement
      : null;
  const inputSelection = activeInput
    ? { start: activeInput.selectionStart, end: activeInput.selectionEnd }
    : null;
  const selection = document.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : [];
  const scroll =
    typeof window === "undefined" ? null : { x: window.scrollX, y: window.scrollY };

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.readOnly = true;
  textarea.tabIndex = -1;
  textarea.setAttribute("aria-hidden", "true");
  Object.assign(textarea.style, {
    position: "fixed",
    left: "-9999px",
    top: "0",
    width: "1px",
    height: "1px",
    opacity: "0",
    pointerEvents: "none",
  });

  let copied = false;
  try {
    document.body.appendChild(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  } finally {
    textarea.remove();

    try {
      activeElement?.focus({ preventScroll: true });
      if (activeInput && inputSelection && inputSelection.start !== null && inputSelection.end !== null) {
        activeInput.setSelectionRange(inputSelection.start, inputSelection.end);
      } else if (selection) {
        selection.removeAllRanges();
        ranges.forEach((range) => selection.addRange(range));
      }
      if (scroll && typeof window !== "undefined") window.scrollTo(scroll.x, scroll.y);
    } catch {
      // Copy success should not be downgraded if restoring focus is unsupported.
    }
  }

  return copied;
}
