// Description: Injects an AI Reply button and tone selector into the toolbar when a new IG table is detected in the DOM.

const IG_TABLE_SELECTOR = "table.IG";
const TOOLBAR_SELECTORS = [".btC", "gU.Up"];
const AI_REPLY_BUTTON_CLASS = "ai-reply-button";
const TONE_SELECTOR_CLASS = "tone-selector";
const EMAIL_CONTENT_SELECTOR = [".a3s.aiL", "gmail_quote", ".h7"];

// Utility function to check if an IG table is present in the DOM
function isTableIGPresent(target) {
  if (
    target.nodeType === Node.ELEMENT_NODE &&
    target.querySelector(IG_TABLE_SELECTOR)
  )
    return true;

  const containerTags = ["DIV", "BODY", "HTML", "MAIN"];
  if (containerTags.includes(target.nodeName)) {
    return target.querySelector(IG_TABLE_SELECTOR) !== null;
  }

  return false;
}

// Finds the toolbar using predefined selectors
function findToolbar() {
  return TOOLBAR_SELECTORS.map((selector) =>
    document.querySelector(selector)
  ).find(Boolean);
}

// Creates the AI Reply button
function createAIReplyButton() {
  const button = document.createElement("div");
  button.className = `T-I J-J5-Ji aoO v7 T-I-atl L3 ${AI_REPLY_BUTTON_CLASS}`;
  button.style.cssText =
    "margin-right: 10px; border-radius: 18px; padding: 8px;";
  button.textContent = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");
  return button;
}

// Creates the tone selector dropdown
function createToneSelector() {
  const select = document.createElement("select");
  select.className = `T-I J-J5-Ji hG T-I-atl L3 ${TONE_SELECTOR_CLASS}`;
  select.setAttribute("aria-label", "Select tone");
  select.style.cssText =
    "margin-right: 10px; border-radius: 18px; padding: 8px;";

  ["Professional", "Friendly", "Casual"].forEach((tone) => {
    const option = document.createElement("option");
    option.value = tone.toLowerCase();
    option.textContent = tone;
    select.appendChild(option);
  });

  return select;
}

// get the email content

function getEmailContent() {
  for (const selector of EMAIL_CONTENT_SELECTOR) {
    const emailContent = document.querySelector(selector);
    if (emailContent) return emailContent.textContent.trim();
  }
  return "";
}

// Injects the AI Reply button and tone selector into the toolbar
function injectButton() {
  const toolbar = findToolbar();
  if (!toolbar) {
    console.log("No toolbar found.");
    return;
  }

  // Remove existing button and tone selector if they exist
  toolbar.querySelector(`.${AI_REPLY_BUTTON_CLASS}`)?.remove();
  toolbar.querySelector(`.${TONE_SELECTOR_CLASS}`)?.remove();

  // Create and inject the button and tone selector
  const button = createAIReplyButton();
  const toneSelector = createToneSelector();

  toolbar.insertBefore(toneSelector, toolbar.firstChild);
  toolbar.insertBefore(button, toolbar.firstChild.nextSibling);


  button.addEventListener("click", async () => {
    try {
      button.textContent = "Generating...";
      button.disabled = true;

      const emailContent = getEmailContent();
      const tone = toneSelector.value;

      const response = await fetch("https://email-assistant-latest.onrender.com/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailContent, tone }),
      });

      if (response.status !== 200) {
        throw new Error("Failed to generate AI reply");
      }

      const reply = await response.text();

      const composer = document.querySelector(
        "[role=textbox]",
        "[g_editable=true]"
      );
      if (composer) {
        composer.focus();
        composer.textContent = ""; // Clear the composer
        document.execCommand("insertText", false, reply);
      }
    } catch (error) {
      console.error("Error while generating AI reply:", error);
      alert("Failed to generate AI reply");
    } finally{
      button.textContent = "AI Reply";
      button.disabled = false;
    }
  });
}

// MutationObserver callback to detect changes in the DOM
function handleMutations(mutationsList) {
  for (const mutation of mutationsList) {
    if (Array.from(mutation.addedNodes).some(isTableIGPresent)) {
      console.log("Composer detected!");
      setTimeout(injectButton, 500);
      break;
    }
  }
}

// Initialize MutationObserver to monitor DOM changes
function initializeObserver() {
  const observer = new MutationObserver(handleMutations);
  observer.observe(document.body, { childList: true, subtree: true });
  console.log("MutationObserver initialized.");
}

// Start the script
initializeObserver();
