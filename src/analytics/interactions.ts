function processInteraction(element: HTMLElement, actionType: string) {
  const trackingName = element.getAttribute("data-tracking-name");
  const trackingType = element.getAttribute("data-tracking-type") || element.tagName.toLowerCase();
  
  const groupElement = element.closest("[data-tracking-group]");
  const trackingGroup = groupElement ? groupElement.getAttribute("data-tracking-group")?.trim() : null;

  const subGroupElement = element.closest("[data-tracking-subgroup]");
  const trackingSubGroup = subGroupElement ? subGroupElement.getAttribute("data-tracking-subgroup")?.trim() : null;
  
  const pageName = trackingGroup || (window as any).__pageId;
  
  let elementValue: string | boolean | undefined = undefined;
  const tagName = element.tagName.toLowerCase();

  if (tagName === "input") {
    const inputEl = element as HTMLInputElement;
    const inputType = inputEl.type.toLowerCase();

    if (inputType === "checkbox") {
      elementValue = inputEl.checked;
    } else if (inputType === "radio") {
      elementValue = inputEl.value;
    } else if (inputType === "password") {
      elementValue = "[REDACTED]";
    } else if (inputType !== "submit" && inputType !== "button") {
      const canCaptureValue = element.getAttribute("data-capture-value") === "true";
      elementValue = canCaptureValue && inputEl.value ? inputEl.value : (inputEl.value ? "[HAS_VALUE]" : "[EMPTY]");
    }
  } else if (tagName === "select") {
    const selectEl = element as HTMLSelectElement;
    elementValue = selectEl.options[selectEl.selectedIndex]?.text;
  } else if (tagName === "textarea") {
    const canCaptureValue = element.getAttribute("data-capture-value") === "true";
    const textareaEl = element as HTMLTextAreaElement;
    elementValue = canCaptureValue && textareaEl.value ? textareaEl.value : (textareaEl.value ? "[HAS_VALUE]" : "[EMPTY]");
  }

  const elementUrl = element.getAttribute("data-tracking-url") || element.getAttribute("href");

  const elementData: Record<string, any> = {
    name: trackingName,
    type: trackingType
  };

  // UPDATED LOGIC: Only set subgroup if trackingGroup exists
  if (trackingGroup) {
    elementData.group = trackingGroup;
    
    if (trackingSubGroup) {
      elementData.subGroup = trackingSubGroup;
    }
  }

  if (elementValue !== null && elementValue !== undefined && elementValue !== "") {
    elementData.value = elementValue;
  }

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
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest("[data-tracking-name]") as HTMLElement;
    if (!target) return;

    const tagName = target.tagName.toLowerCase();
    const inputType = (target as HTMLInputElement).type;

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

    const tagName = target.tagName.toLowerCase();
    const inputType = (target as HTMLInputElement).type;
    
    if (inputType === "checkbox" || tagName === "select" || inputType === "radio") {
      processInteraction(target, "change");
    }
  };

  const handleBlur = (event: Event) => {
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