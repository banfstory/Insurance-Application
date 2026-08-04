function processInteraction(element: HTMLElement, actionType: string) {
  const trackingName = element.getAttribute("data-tracking-name");
  const trackingType = element.getAttribute("data-tracking-type") || element.tagName.toLowerCase();
  
  const groupElement = element.closest("[data-tracking-group]");
  const trackingGroup = groupElement ? groupElement.getAttribute("data-tracking-group")?.trim() : null;
  const pageName = trackingGroup || (window as any).__pageId;
  
  const inputElement = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  let elementValue: any = inputElement.value;

  if (inputElement.type === "checkbox") {
    elementValue = (inputElement as HTMLInputElement).checked;
  } else if (inputElement.tagName.toLowerCase() === "select") {
    const selectElement = inputElement as HTMLSelectElement;
    elementValue = selectElement.options[selectElement.selectedIndex]?.text;
  } else if (inputElement.type === "password") {
    elementValue = "[REDACTED]";
  }

  // Extract element URL: check data-tracking-url first, then fallback to href
  const elementUrl = element.getAttribute("data-tracking-url") || element.getAttribute("href");

  const elementData: Record<string, any> = {
    name: trackingName,
    type: trackingType
  };

  if (trackingGroup) {
    elementData.group = trackingGroup;
  }

  if (elementValue !== null && elementValue !== undefined && elementValue !== "") {
    elementData.value = elementValue;
  }

  // Add elementUrl if present
  if (elementUrl) {
    elementData.url = elementUrl;
  }

  const dataLayerPayload = {
    event: actionType,
    pageName: pageName,
    element: elementData
  };

  console.log("Adobe Analytics Payload:", dataLayerPayload);

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(dataLayerPayload);
}

export function initGlobalTracking(): () => void {
  const handleClick = (event: MouseEvent) => {
    // Safely check if event.target is an Element
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest("[data-tracking-name]") as HTMLElement;
    if (!target) return;

    const inputType = (target as HTMLInputElement).type;
    const tagName = target.tagName.toLowerCase();

    if (
      inputType === "radio" ||
      inputType === "checkbox" ||
      tagName === "select" ||
      tagName === "input" ||
      tagName === "textarea"
    ) {
      return;
    }

    processInteraction(target, "click");
  };

  const handleChange = (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest("[data-tracking-name]") as HTMLElement;
    if (!target) return;

    const inputType = (target as HTMLInputElement).type;
    
    if (inputType === "checkbox" || target.tagName.toLowerCase() === "select" || inputType === "radio") {
      processInteraction(target, "change");
    }
  };

  const handleBlur = (event: Event) => {
    // FIX: Guard against non-element targets (like window or document) during blur
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest("[data-tracking-name]") as HTMLElement;
    if (!target) return;

    const tagName = target.tagName.toLowerCase();
    const inputType = (target as HTMLInputElement).type;

    if (tagName === "textarea" || (tagName === "input" && inputType !== "checkbox" && inputType !== "radio" && inputType !== "submit" && inputType !== "button")) {
      processInteraction(target, "blur");
    }
  };

  window.addEventListener("click", handleClick as EventListener, { capture: true });
  window.addEventListener("change", handleChange as EventListener, { capture: true });
  window.addEventListener("blur", handleBlur as EventListener, { capture: true });

  return () => {
    window.removeEventListener("click", handleClick as EventListener, { capture: true });
    window.removeEventListener("change", handleChange as EventListener, { capture: true });
    window.removeEventListener("blur", handleBlur as EventListener, { capture: true });
  };
}