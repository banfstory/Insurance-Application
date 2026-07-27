// src/utils/analytics.ts (or src/analytics/interactions.ts)

function processInteraction(element: HTMLElement, actionType: string) {
  const trackingName = element.getAttribute("data-tracking-name");
  const trackingType = element.getAttribute("data-tracking-type") || element.tagName.toLowerCase();
  
  // Find the closest parent element (or self) that has the data-tracking-group attribute
  const groupElement = element.closest("[data-tracking-group]");
  const trackingGroup = groupElement ? groupElement.getAttribute("data-tracking-group")?.trim() : null;
  
  // Safely fallback to the DOM-derived trackingGroup if window.__pageId lags behind
  const pageName = trackingGroup || (window as any).__pageId;
  
  let elementValue: any = (element as HTMLInputElement | HTMLSelectElement).value;

  // Special handling for checkboxes and radio buttons
  if ((element as HTMLInputElement).type === "checkbox") {
    elementValue = (element as HTMLInputElement).checked;
  } else if (element.tagName.toLowerCase() === "select") {
    const selectElement = element as HTMLSelectElement;
    elementValue = selectElement.options[selectElement.selectedIndex]?.text;
  }

  // Build the element object dynamically, omitting null, undefined, or empty string values
  const elementData: Record<string, any> = {
    name: trackingName,
    type: trackingType
  };

  if (trackingGroup) {
    elementData.group = trackingGroup;
  }

  // Check if value is valid (not null, undefined, or empty string)
  if (elementValue !== null && elementValue !== undefined && elementValue !== "") {
    elementData.value = elementValue;
  }

  const dataLayerPayload = {
    event: actionType,
    pageName: pageName, // Uses the guaranteed current page context
    element: elementData
  };

  console.log("Adobe Analytics Payload:", dataLayerPayload);

  // Extend window object type safety if needed, or fallback safely
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(dataLayerPayload);
}

export function initGlobalTracking(): () => void {
  const handleClick = (event: MouseEvent) => {
    const target = (event.target as HTMLElement)?.closest("[data-tracking-name]") as HTMLElement;
    if (!target) return;

    // Ignore click events for radio buttons and select dropdowns so they only fire on 'change'
    if (
      (target as HTMLInputElement).type === "radio" ||
      target.tagName.toLowerCase() === "select"
    ) {
      return;
    }

    processInteraction(target, "click");
  };

  const handleChange = (event: Event) => {
    const target = (event.target as HTMLElement)?.closest("[data-tracking-name]") as HTMLElement;
    if (!target) return;
    processInteraction(target, "change");
  };

  // Attach listeners with capture phase to intercept the click before state changes flush
  window.addEventListener("click", handleClick as EventListener, { capture: true });
  window.addEventListener("change", handleChange as EventListener, { capture: true });

  // Return a cleanup function to remove the exact same listeners
  return () => {
    window.removeEventListener("click", handleClick as EventListener, { capture: true });
    window.removeEventListener("change", handleChange as EventListener, { capture: true });
  };
}