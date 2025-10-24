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
  const currentPageId = window.surftrust_globals.current_page_id || 0;

  let notificationQueue = [];
  let currentNotificationElement = null;
  // --- 1. HEARTBEAT PINGER ---
  // This function will run immediately and then every 45 seconds.
  function sendHeartbeat() {
    fetch(`${apiUrl}/heartbeat`, { method: "POST" }).catch((error) =>
      console.error("Surftrust: Heartbeat failed.", error)
    );
  }
  sendHeartbeat(); // Send one immediately on page load
  setInterval(sendHeartbeat, 45000); // Send one every 45 seconds

  // --- 2. DATA FETCHING ---
  fetch(`${apiUrl}/public/data?current_page_id=${currentPageId}`)
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
    notificationQueue = hasConsented
      ? campaigns.filter((c) => c.type !== "cookie_notice")
      : campaigns;
    shuffleArray(notificationQueue);
  }

  // --- 3. THE DISPLAY LOOP ---
  async function startNotificationLoop() {
    const maxDisplays = globalCustomize.max_displays_per_session || 0;
    const sessionStorageKey = "surftrust_session_view_count";
    let sessionViewCount = parseInt(
      sessionStorage.getItem(sessionStorageKey) || "0",
      10
    );
    const initialDelay = (globalCustomize.initial_delay || 3) * 1000;

    await sleep(initialDelay);
    for (const campaign of notificationQueue) {
      // --- NEW: Check the limit before showing a notification ---
      // If a limit is set (not 0) and we have reached it, break the loop.
      if (maxDisplays > 0 && sessionViewCount >= maxDisplays) {
        console.log(
          `Surftrust: Frequency cap of ${maxDisplays} reached. Halting loop.`
        );
        break;
      }
      await showNotification(campaign);

      sessionViewCount++;
      sessionStorage.setItem(sessionStorageKey, sessionViewCount);

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
  // /src-jsx/public.js

  // In /src-jsx/public.js

  function showNotification(campaign) {
    return new Promise(async (resolve) => {
      // --- START: FINAL CORRECTED OVERRIDE LOGIC ---
      console.log("--- DEBUG START ---");
      console.log("Global Settings:", globalCustomize);
      console.log("Campaign Settings:", campaign.settings.customize);
      // 1. Get the campaign's specific rule. Default to 'global' if not set.
      const campaignRule =
        campaign.settings?.customize?.device_targeting || "global";

      // 2. Determine the final, effective rule.
      let finalDeviceRule;
      if (campaignRule !== "global") {
        // If the campaign has a specific override ('all', 'desktop', or 'mobile'), use it.
        finalDeviceRule = campaignRule;
      } else {
        // Otherwise, the campaign is set to "Use Global". Now we use the actual global setting.
        // If the global setting doesn't exist, the ultimate fallback is 'all'.
        finalDeviceRule = globalCustomize.device_targeting || "all";
      }

      // 3. Perform the check using the final, correct rule.
      const isMobile = window.innerWidth <= 768;
      if (
        (finalDeviceRule === "desktop" && isMobile) ||
        (finalDeviceRule === "mobile" && !isMobile)
      ) {
        console.log(
          `SurfPop: Notification ${campaign.id} skipped due to device targeting rule: "${finalDeviceRule}"`
        );
        resolve();
        return;
      }

      // --- END: FINAL CORRECTED OVERRIDE LOGIC ---

      // The rest of the function can now proceed, as we know the notification should be shown.
      if (currentNotificationElement) await hideNotification();

      const html = renderNotificationHTML(campaign);

      if (!html) {
        resolve();
        return;
      }
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const notificationEl = wrapper.firstElementChild;

      // The applyStyles function is correct because it merges the objects internally.
      applyStyles(notificationEl, campaign.settings);

      document.body.appendChild(notificationEl);
      currentNotificationElement = notificationEl;

      const clickArea = notificationEl.querySelector(".surftrust-click-area");
      if (clickArea) {
        clickArea.addEventListener("click", (e) => {
          if (campaign.type !== "growth_alert") {
            e.preventDefault();
          }
          handleNotificationClick(campaign);
        });
      }
      if (campaign.type === "cookie_notice") {
        const acceptBtn = notificationEl.querySelector(
          ".surftrust-cookie-accept"
        );
        if (acceptBtn) {
          acceptBtn.addEventListener("click", () => {
            const d = new Date();
            d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
            document.cookie =
              "surftrust_cookie_consent=true;expires=" +
              d.toUTCString() +
              ";path=/";
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
        initializeCountdown(notificationEl);
        resolve();
      }, 100);
    });
  }

  function hideNotification() {
    return new Promise((resolve) => {
      if (currentNotificationElement) {
        const el = currentNotificationElement;
        // Clear any running countdown timers before hiding
        if (el.dataset.countdownInterval) {
          clearInterval(parseInt(el.dataset.countdownInterval, 10));
        }
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
    const defaultMessages = {
      sale: "{first_name} in {city} just bought {product_name}!",
      review: "{reviewer_name} left a {rating}-star review for {product_name}!",
      stock: "Hurry! Only {stock_count} of {product_name} left in stock!",
      live_visitors: "join {count} vistors/vistor",
      growth_alert: "like this ?!share on ",
      sale_announcement: "Big sale on {product_name}",
      cookie_notice: "this website uses cookie notices",
      // ... (add other defaults)
    };
    const campaignTypeSettings =
      settings[type] ||
      settings[type + "_announcement"] ||
      settings[type + "_notification"] ||
      settings[type + "s_notification"] ||
      {};
    message =
      campaignTypeSettings.message ||
      defaultMessages[type] ||
      "A new event just happened!";

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
        imageUrl = fallbackIconUrl;
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
      case "live_visitors":
        imageUrl = fallbackIconUrl;
        message = message.replace(
          "{count}",
          `<strong>${data.count || 1}</strong>`
        );
        break;
      case "sale_announcement": {
        imageUrl = data.product_image_url || fallbackIconUrl;
        meta = ""; // No meta for this type
        message = message.replace(
          "{product_name}",
          `<strong>${data.product_name || ""}</strong>`
        );
        message = message.replace("{sale_price}", data.sale_price || "");
        message = message.replace(
          "{regular_price}",
          `<del>${data.regular_price || ""}</del>`
        );
        message = message.replace(
          "{discount_percentage}",
          data.discount_percentage || "0"
        );

        // Add placeholder for countdown timer if sale has an end date
        if (data.sale_end_date) {
          message += `<div class="surftrust-countdown-timer" data-end-time="${data.sale_end_date}"></div>`;
        }
        break;
      }
      case "cookie_notice": {
        const buttonText = campaignTypeSettings.button_text || "Accept";
        return `<div class="surftrust-notification-wrapper"><div class="surftrust-content"><p>${message}</p><button class="surftrust-cookie-accept button">${buttonText}</button></div></div>`;
      }
      case "growth_alert": {
        const currentPageUrl = encodeURIComponent(window.location.href);
        const currentPageTitle = encodeURIComponent(document.title);
        let socialLinks =
          '<div style="display: flex; gap: 10px; margin-top: 10px;">';
        if (campaignTypeSettings.enable_facebook)
          socialLinks += `<a href="https://www.facebook.com/sharer/sharer.php?u=${currentPageUrl}" target="_blank">Facebook</a>`;
        if (campaignTypeSettings.enable_twitter)
          socialLinks += `<a href="https://twitter.com/intent/tweet?url=${currentPageUrl}&text=${currentPageTitle}" target="_blank">X/Twitter</a>`;
        if (campaignTypeSettings.enable_pinterest)
          socialLinks += `<a href="https://pinterest.com/pin/create/button/?url=${currentPageUrl}&media=&description=${currentPageTitle}" target="_blank">Pinterest</a>`;
        socialLinks += "</div>";
        return `<div class="surftrust-notification-wrapper"><div class="surftrust-content"><p>${message}</p>${socialLinks}</div></div>`;
      }
      default:
        return "";
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

  /**
   * Finds and initializes any countdown timers in a notification.
   */
  function initializeCountdown(notificationEl) {
    const timerEl = notificationEl.querySelector(".surftrust-countdown-timer");
    if (!timerEl) return;

    const endTime = parseInt(timerEl.dataset.endTime, 10) * 1000;
    if (isNaN(endTime) || !endTime) return;

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(intervalId);
        timerEl.innerHTML = "Sale has ended!";
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      timerEl.innerHTML = `Sale ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);

    notificationEl.dataset.countdownInterval = intervalId;
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
0;
