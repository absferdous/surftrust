// /src-jsx/public.js

(function () {
  // --- 0. SAFETY CHECK ---
  if (typeof window.surftrust_globals === "undefined" || !window.surftrust_globals.api_url) {
    console.error("Surftrust: Global data from WordPress is missing. The plugin cannot run.");
    return;
  }

  // --- 1. CONFIGURATION & STATE ---
  const globalCustomize = window.surftrust_globals.customize || {};
  const apiUrl = window.surftrust_globals.api_url;
  let notificationQueue = [];
  let currentNotificationElement = null;

  // --- 2. DATA FETCHING ---
  fetch(`${apiUrl}/public/data`).then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }).then(campaigns => {
    if (campaigns && Array.isArray(campaigns) && campaigns.length > 0) {
      buildQueue(campaigns);
      startNotificationLoop();
    }
  }).catch(error => {
    console.error("Surftrust: Error fetching campaign data.", error);
  });

  /**
   * Builds the master queue from the fetched data.
   */
  function buildQueue(campaigns) {
    notificationQueue = campaigns;
    shuffleArray(notificationQueue); // This will now work
  }

  // --- 3. THE DISPLAY LOOP ---
  async function startNotificationLoop() {
    const initialDelay = (globalCustomize.initial_delay || 3) * 1000;
    await sleep(initialDelay);
    for (const campaign of notificationQueue) {
      await showNotification(campaign);
      const displayDuration = (campaign.settings?.customize?.display_duration ?? globalCustomize.display_duration ?? 5) * 1000;
      if (displayDuration > 0) {
        await sleep(displayDuration);
        await hideNotification();
      }
      const delayBetween = (globalCustomize.delay_between || 2) * 1000;
      await sleep(delayBetween);
    }
  }

  // --- 4. DOM MANIPULATION & RENDERING ---
  function showNotification(campaign) {
    return new Promise(async resolve => {
      if (currentNotificationElement) await hideNotification();
      const html = renderNotificationHTML(campaign);
      if (!html) {
        resolve();
        return;
      }
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const notificationEl = wrapper.firstElementChild;
      applyStyles(notificationEl, campaign.settings);
      document.body.appendChild(notificationEl);
      currentNotificationElement = notificationEl;
      const clickArea = notificationEl.querySelector(".surftrust-click-area");
      if (clickArea) {
        clickArea.addEventListener("click", e => {
          e.preventDefault();
          handleNotificationClick(campaign);
        });
      }
      const closeBtn = notificationEl.querySelector(".surftrust-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", e => {
          e.stopPropagation();
          hideNotification();
        });
      }
      setTimeout(() => {
        notificationEl.classList.add("is-visible");
        trackEvent("view", campaign);
        resolve();
      }, 100);
    });
  }

  // --- THIS FUNCTION WAS MISSING ---
  function hideNotification() {
    return new Promise(resolve => {
      if (currentNotificationElement) {
        const el = currentNotificationElement;
        el.classList.remove("is-visible");
        setTimeout(() => {
          el.remove();
          if (currentNotificationElement === el) {
            currentNotificationElement = null;
          }
          resolve();
        }, 500);
      } else {
        resolve();
      }
    });
  }
  function renderNotificationHTML(campaign) {
    const {
      type,
      data,
      settings
    } = campaign;
    let message = "";
    let meta = data.time_ago || "";
    let imageUrl = data.product_image_url || null;
    const campaignTypeSettings = settings[type + "_notification"] || settings[type + "s_notification"] || {}; // Handles singular/plural
    message = campaignTypeSettings.message;
    if (!message) {
      switch (type) {
        case "sale":
          message = "{first_name} in {city} just bought {product_name}!";
          break;
        case "review":
          message = "{reviewer_name} left a {rating}-star review for {product_name}!";
          break;
        case "stock":
          message = "Hurry! Only {stock_count} of {product_name} left in stock!";
          break;
        default:
          message = "A new event just happened!";
      }
    }
    message = message.replace("{first_name}", data.customer_name || "Someone");
    message = message.replace("{product_name}", `<strong>${data.product_name || ""}</strong>`);
    message = message.replace("{city}", data.city || "somewhere");
    message = message.replace("{rating}", data.rating || "5");
    message = message.replace("{reviewer_name}", data.reviewer_name || "A customer");
    message = message.replace("{stock_count}", data.stock_count || "only a few");
    const closeBtnHtml = globalCustomize.show_close_button ? `<button class="surftrust-close-btn">&times;</button>` : "";
    const imageHtml = imageUrl ? `<div class="surftrust-image"><img src="${imageUrl}" alt="${data.product_name}"></div>` : "";
    return `
            <div class="surftrust-notification-wrapper">
                <a href="${data.product_url || "#"}" class="surftrust-click-area">
                    ${closeBtnHtml}
                    ${imageHtml}
                    <div class="surftrust-content">
                        <p>${message}</p>
                        <p class="meta">${meta}</p>
                    </div>
                </a>
            </div>
        `;
  }
  function applyStyles(el, campaignSettings) {
    const customize = {
      ...globalCustomize,
      ...(campaignSettings.customize || {})
    };
    el.style.fontFamily = customize.font_family || "sans-serif";
    el.style.fontSize = `${customize.font_size || 14}px`;
    el.style.backgroundColor = customize.background_color || "#ffffff";
    el.style.color = customize.font_color || "#000000";
    el.style.borderRadius = `${customize.border_radius || 6}px`;
    if (customize.enable_shadow) {
      el.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
    }
    const position = campaignSettings[Object.keys(campaignSettings).find(k => k.includes("notification"))]?.position || globalCustomize.position || "bottom-left";
    el.classList.add(`surftrust-position-${position}`);
    el.classList.add(`surftrust-animation-${customize.animation_style || "fade"}`);
  }

  // --- 5. ANALYTICS TRACKING ---
  async function handleNotificationClick(campaign) {
    try {
      await trackEvent("click", campaign);
    } catch (error) {
      console.error("Click tracking failed, but proceeding with navigation.", error);
    } finally {
      if (campaign.data.product_url) {
        window.location.href = campaign.data.product_url;
      }
    }
  }
  function trackEvent(eventType, campaign) {
    const payload = {
      notification_type: campaign.type,
      // --- THIS IS THE FINAL FIX ---
      // Use the top-level 'id' from the campaign object, which is the Post ID
      notification_id: campaign.id,
      product_id: campaign.data.product_id || 0
    };
    return fetch(`${apiUrl}/track/${eventType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).catch(err => console.error(`Surftrust: Failed to track ${eventType}`, err));
  }

  // --- 6. HELPER FUNCTIONS ---

  // --- THIS FUNCTION WAS MISSING ---
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
})();