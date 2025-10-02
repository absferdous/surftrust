// /src-jsx/public.js

(function () {
  // --- 0. SAFETY CHECK ---
  if (
    typeof window.surftrust_globals === "undefined" ||
    !window.surftrust_globals.api_url
  ) {
    console.error(
      "Surftrust: Global data from WordPress is missing. The plugin cannot run."
    );
    return;
  }

  // --- 1. CONFIGURATION & STATE ---
  const globalCustomize = window.surftrust_globals.customize || {};
  const apiUrl = window.surftrust_globals.api_url;

  let notificationQueue = [];
  let currentNotificationElement = null;

  // --- 2. DATA FETCHING ---
  fetch(`${apiUrl}/public/data`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((campaigns) => {
      if (campaigns && Array.isArray(campaigns) && campaigns.length > 0) {
        buildQueue(campaigns);
        if (notificationQueue.length > 0) {
          startNotificationLoop();
        }
      }
    })
    .catch((error) => {
      console.error("Surftrust: Error fetching campaign data.", error);
    });

  /**
   * Builds and filters the master queue from the fetched campaigns.
   */
  function buildQueue(campaigns) {
    const hasConsented =
      document.cookie.indexOf("surftrust_cookie_consent=true") > -1;

    // Filter out cookie notices if the user has already consented.
    notificationQueue = hasConsented
      ? campaigns.filter((c) => c.type !== "cookie_notice")
      : campaigns;

    shuffleArray(notificationQueue);
  }

  // --- 3. THE DISPLAY LOOP ---
  async function startNotificationLoop() {
    const initialDelay = (globalCustomize.initial_delay || 3) * 1000;
    await sleep(initialDelay);

    for (const campaign of notificationQueue) {
      await showNotification(campaign);
      const displayDuration =
        (campaign.settings?.customize?.display_duration ??
          globalCustomize.display_duration ??
          5) * 1000;
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
    return new Promise(async (resolve) => {
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

      // Generic click handler for campaigns that link somewhere
      const clickArea = notificationEl.querySelector(".surftrust-click-area");
      if (clickArea) {
        clickArea.addEventListener("click", (e) => {
          // Don't prevent default for social links
          if (campaign.type !== "growth_alert") {
            e.preventDefault();
          }
          handleNotificationClick(campaign);
        });
      }

      // Special logic for cookie notice button
      if (campaign.type === "cookie_notice") {
        const acceptBtn = notificationEl.querySelector(
          ".surftrust-cookie-accept"
        );
        if (acceptBtn) {
          acceptBtn.addEventListener("click", () => {
            const d = new Date();
            d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000); // Expires in 30 days
            let expires = "expires=" + d.toUTCString();
            document.cookie =
              "surftrust_cookie_consent=true;" + expires + ";path=/";
            hideNotification();
          });
        }
      }

      const closeBtn = notificationEl.querySelector(".surftrust-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
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

  function hideNotification() {
    return new Promise((resolve) => {
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
    const { type, data, settings } = campaign;
    let message = "";
    let meta = data.time_ago || "";
    let imageUrl = null;
    const pluginUrl = window.surftrust_globals.plugin_url || "../";
    const fallbackIconUrl = `${pluginUrl}public/images/avatar-1.svg`;

    const campaignTypeSettings =
      settings[type] ||
      settings[type + "_notification"] ||
      settings[type + "s_notification"] ||
      {};

    // Handle different possible structures for the message
    message =
      campaignTypeSettings.message ||
      settings[type]?.message ||
      "A new event just happened!";

    // Render based on type
    switch (type) {
      case "sale":
      case "stock":
        imageUrl = data.product_image_url || fallbackIconUrl;
        message = message.replace(
          "{first_name}",
          data.customer_name || "Someone"
        );
        message = message.replace(
          "{product_name}",
          `<strong>${data.product_name || ""}</strong>`
        );
        message = message.replace("{city}", data.city || "somewhere");
        message = message.replace(
          "{stock_count}",
          data.stock_count || "only a few"
        );
        if (type === "stock") meta = "Limited stock available";
        break;
      case "review":
        imageUrl = fallbackIconUrl; // Always use fallback for reviews
        message = message.replace(
          "{reviewer_name}",
          data.reviewer_name || "A customer"
        );
        message = message.replace("{rating}", data.rating || "5");
        message = message.replace(
          "{product_name}",
          `<strong>${data.product_name || ""}</strong>`
        );
        break;
      case "cookie_notice": {
        const buttonText = campaignTypeSettings.button_text || "Accept";
        return `
                    <div class="surftrust-notification-wrapper">
                        <div class="surftrust-content">
                            <p>${message}</p>
                            <button class="surftrust-cookie-accept button">${buttonText}</button>
                        </div>
                    </div>
                `;
      }
      case "growth_alert": {
        const currentPageUrl = encodeURIComponent(window.location.href);
        const currentPageTitle = encodeURIComponent(document.title);

        let socialLinks =
          '<div style="display: flex; gap: 10px; margin-top: 10px;">';
        if (campaignTypeSettings.enable_facebook)
          socialLinks += `<a href="https://www.facebook.com/sharer/sharer.php?u=${currentPageUrl}" target="_blank" class="surftrust-social-link">Facebook</a>`;
        if (campaignTypeSettings.enable_twitter)
          socialLinks += `<a href="https://twitter.com/intent/tweet?url=${currentPageUrl}&text=${currentPageTitle}" target="_blank" class="surftrust-social-link">X/Twitter</a>`;
        if (campaignTypeSettings.enable_pinterest)
          socialLinks += `<a href="https://pinterest.com/pin/create/button/?url=${currentPageUrl}&media=&description=${currentPageTitle}" target="_blank" class="surftrust-social-link">Pinterest</a>`;
        socialLinks += "</div>";

        return `
                    <div class="surftrust-notification-wrapper">
                        <div class="surftrust-content">
                            <p>${message}</p>
                            ${socialLinks}
                        </div>
                    </div>
                `;
      }
      default:
        return ""; // Don't render unknown types
    }

    const closeBtnHtml = globalCustomize.show_close_button
      ? `<button class="surftrust-close-btn">&times;</button>`
      : "";
    const imageHtml = imageUrl
      ? `<div class="surftrust-image"><img src="${imageUrl}" alt="Notification Icon"></div>`
      : "";

    return `
            <div class="surftrust-notification-wrapper">
                <a href="${
                  data.product_url || "#"
                }" class="surftrust-click-area">
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
      ...(campaignSettings.customize || {}),
    };
    el.style.fontFamily = customize.font_family || "sans-serif";
    el.style.fontSize = `${customize.font_size || 14}px`;
    el.style.backgroundColor = customize.background_color || "#ffffff";
    el.style.color = customize.font_color || "#000000";
    el.style.borderRadius = `${customize.border_radius || 6}px`;
    if (customize.enable_shadow) {
      el.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
    }
    const positionKey = Object.keys(campaignSettings).find(
      (k) =>
        k.includes("notification") ||
        k.includes("alert") ||
        k.includes("displays")
    );
    const position =
      campaignSettings[positionKey]?.position ||
      globalCustomize.position ||
      "bottom-left";
    el.classList.add(`surftrust-position-${position}`);
    el.classList.add(
      `surftrust-animation-${customize.animation_style || "fade"}`
    );
  }

  // --- 5. ANALYTICS TRACKING ---
  async function handleNotificationClick(campaign) {
    try {
      await trackEvent("click", campaign);
    } catch (error) {
      console.error("Click tracking failed.", error);
    } finally {
      // Only redirect if it's not a growth alert, which opens a new tab
      if (campaign.type !== "growth_alert" && campaign.data.product_url) {
        window.location.href = campaign.data.product_url;
      }
    }
  }

  function trackEvent(eventType, campaign) {
    const payload = {
      notification_type: campaign.type,
      notification_id: campaign.id,
      product_id: campaign.data?.product_id || 0,
    };
    return fetch(`${apiUrl}/track/${eventType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) =>
      console.error(`Surftrust: Failed to track ${eventType}`, err)
    );
  }

  // --- 6. HELPER FUNCTIONS ---
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
})();
