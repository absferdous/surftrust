// /src-jsx/public.js

(function () {
  // Safety Check: Does the data object from PHP even exist?
  if (
    typeof window.surftrust_data === "undefined" ||
    !window.surftrust_data.api_url
  ) {
    console.error(
      "Surftrust: Data object from WordPress is missing. The plugin cannot run."
    );
    return; // Stop execution immediately
  }

  // --- 1. CONFIGURATION & STATE ---
  const settings = window.surftrust_data.settings;
  const apiUrl = window.surftrust_data.api_url;
  let notificationQueue = [];
  let currentNotificationElement = null; // A reference to the currently visible pop-up

  const areAnyNotificationsEnabled =
    settings?.sales_notification?.enabled ||
    settings?.low_stock_alert?.enabled ||
    settings?.review_displays?.enabled;

  if (!areAnyNotificationsEnabled) {
    return; // Silently exit if nothing is enabled.
  }

  // --- 2. DATA FETCHING & QUEUE BUILDING ---
  fetch(`${apiUrl}/public/data`)
    .then((response) => response.json())
    .then((data) => {
      buildQueue(data);
      if (notificationQueue.length > 0) {
        startNotificationLoop();
      }
    })
    .catch((error) => {
      console.error("Surftrust: Error fetching notification data.", error);
    });

  /**
   * Builds the master queue from the fetched data based on settings.
   */
  function buildQueue(data) {
    if (settings.sales_notification?.enabled && data.sales) {
      data.sales.forEach((sale) => {
        notificationQueue.push({ type: "sale", data: sale });
      });
    }
    if (settings.review_displays?.enabled && data.reviews) {
      data.reviews.forEach((review) => {
        if (review.rating >= (settings.review_displays.min_rating || 1)) {
          notificationQueue.push({ type: "review", data: review });
        }
      });
    }
    if (settings.low_stock_alert?.enabled && data.stock) {
      data.stock.forEach((product) => {
        notificationQueue.push({ type: "stock", data: product });
      });
    }
    shuffleArray(notificationQueue);
  }

  // --- 3. THE DISPLAY LOOP ---
  async function startNotificationLoop() {
    const initialDelay = (settings.customize?.initial_delay || 3) * 1000;
    await sleep(initialDelay);

    for (const notification of notificationQueue) {
      await showNotification(notification);
      const displayDuration =
        (settings.customize?.display_duration || 5) * 1000;
      if (displayDuration > 0) {
        await sleep(displayDuration);
        await hideNotification();
      }
      const delayBetween = (settings.customize?.delay_between || 2) * 1000;
      await sleep(delayBetween);
    }
  }

  // --- 4. DOM MANIPULATION & RENDERING ---

  /**
   * Creates, styles, and displays a notification pop-up.
   */
  function showNotification(notification) {
    return new Promise(async (resolve) => {
      if (currentNotificationElement) {
        await hideNotification();
      }
      const html = renderNotificationHTML(notification);
      if (!html) {
        resolve();
        return;
      }
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const notificationEl = wrapper.firstElementChild;
      applyStyles(notificationEl);
      document.body.appendChild(notificationEl);
      currentNotificationElement = notificationEl;
      const clickArea = notificationEl.querySelector(".surftrust-click-area");
      if (clickArea) {
        clickArea.addEventListener("click", (e) => {
          e.preventDefault();
          handleNotificationClick(notification);
        });
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
        trackEvent("view", notification);
        resolve();
      }, 100);
    });
  }

  /**
   * Hides and removes the currently visible notification.
   */
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

  /**
   * Generates the inner HTML for a notification based on its type.
   */
  function renderNotificationHTML(notification) {
    const { type, data } = notification;
    let message = "";
    let meta = data.time_ago || "";
    let imageUrl = data.product_image_url || null;
    switch (type) {
      case "sale":
        message =
          settings.sales_notification?.message ||
          "{product_name} was just purchased!";
        message = message.replace(
          "{first_name}",
          data.customer_name || "Someone"
        );
        message = message.replace(
          "{product_name}",
          `<strong>${data.product_name}</strong>`
        );
        message = message.replace("{city}", data.city || "somewhere");
        break;
      case "review":
        message = `<strong>${data.reviewer_name || "Someone"}</strong> left a ${
          data.rating
        }-star review for <strong>${data.product_name}</strong>!`;
        break;
      case "stock":
        message = `Hurry! Only <strong>${data.stock_count}</strong> of <strong>${data.product_name}</strong> left in stock!`;
        meta = "Limited stock available";
        break;
      default:
        return "";
    }
    const closeBtnHtml = settings.customize?.show_close_button
      ? `<button class="surftrust-close-btn">&times;</button>`
      : "";
    const imageHtml = imageUrl
      ? `<div class="surftrust-image"><img src="${imageUrl}" alt="${data.product_name}"></div>`
      : "";
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

  /**
   * Applies dynamic styles from settings to the notification element.
   */
  function applyStyles(el) {
    const customize = settings.customize || {};
    el.style.fontFamily = customize.font_family || "sans-serif";
    el.style.fontSize = `${customize.font_size || 14}px`;
    el.style.backgroundColor = customize.background_color || "#ffffff";
    el.style.color = customize.font_color || "#000000";
    el.style.borderRadius = `${customize.border_radius || 6}px`;
    if (customize.enable_shadow) {
      el.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
    }
    const position = settings.sales_notification?.position || "bottom-left";
    el.classList.add(`surftrust-position-${position}`);
    el.classList.add(
      `surftrust-animation-${customize.animation_style || "fade"}`
    );
  }

  // --- 5. ANALYTICS TRACKING ---

  // --- START CHANGE 1: Make handleNotificationClick async ---
  async function handleNotificationClick(notification) {
    try {
      // Wait for the tracking request to complete before redirecting
      await trackEvent("click", notification);
    } catch (error) {
      console.error(
        "Click tracking failed, but proceeding with navigation.",
        error
      );
    } finally {
      // This 'finally' block ensures the redirect happens even if tracking fails.
      if (notification.data.product_url) {
        window.location.href = notification.data.product_url;
      }
    }
  }
  // --- END CHANGE 1 ---

  // --- START CHANGE 2: Return the fetch promise ---
  function trackEvent(eventType, notification) {
    const payload = {
      notification_type: notification.type,
      product_id: notification.data.product_id || 0,
    };

    // Add 'return' so we can await this function's completion
    return fetch(`${apiUrl}/track/${eventType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) =>
      console.error(`Surftrust: Failed to track ${eventType}`, err)
    );
  }
  // --- END CHANGE 2 ---

  // --- 6. HELPER FUNCTIONS ---

  /**
   * Shuffles an array in place.
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * A helper to wait for a specific amount of time.
   */
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
})();
