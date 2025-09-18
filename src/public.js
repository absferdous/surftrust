// /src-jsx/public.js

(function () {
  // Safety Check: Does the data object from PHP even exist?
  if (typeof window.surftrust_data === "undefined" || !window.surftrust_data.api_url) {
    console.error("Surftrust: Data object from WordPress is missing. The plugin cannot run.");
    return; // Stop execution immediately
  }

  // --- 1. CONFIGURATION & STATE ---
  const settings = window.surftrust_data.settings;
  const apiUrl = window.surftrust_data.api_url;
  let notificationQueue = [];
  let currentNotificationElement = null; // A reference to the currently visible pop-up

  const areAnyNotificationsEnabled = settings?.sales_notification?.enabled || settings?.low_stock_alert?.enabled || settings?.review_displays?.enabled;
  if (!areAnyNotificationsEnabled) {
    return; // Silently exit if nothing is enabled.
  }

  // --- 2. DATA FETCHING & QUEUE BUILDING ---
  fetch(`${apiUrl}/public/data`).then(response => response.json()).then(data => {
    buildQueue(data);
    if (notificationQueue.length > 0) {
      startNotificationLoop();
    }
  }).catch(error => {
    console.error("Surftrust: Error fetching notification data.", error);
  });

  /**
   * Builds the master queue from the fetched data based on settings.
   * @param {object} data - The data object from the API (contains sales, reviews, stock).
   */
  function buildQueue(data) {
    // Add sales notifications if enabled
    if (settings.sales_notification?.enabled && data.sales) {
      data.sales.forEach(sale => {
        notificationQueue.push({
          type: "sale",
          data: sale
        });
      });
    }

    // Add review notifications if enabled
    if (settings.review_displays?.enabled && data.reviews) {
      data.reviews.forEach(review => {
        // Apply the minimum rating filter
        if (review.rating >= (settings.review_displays.min_rating || 1)) {
          notificationQueue.push({
            type: "review",
            data: review
          });
        }
      });
    }
    if (settings.low_stock_alert?.enabled && data.stock) {
      data.stock.forEach(product => {
        notificationQueue.push({
          type: "stock",
          data: product
        });
      });
    }
    // Shuffle the queue to make it feel more random and dynamic
    shuffleArray(notificationQueue);
  }

  // --- 3. THE DISPLAY LOOP ---
  async function startNotificationLoop() {
    const initialDelay = (settings.customize?.initial_delay || 3) * 1000;
    await sleep(initialDelay);
    for (const notification of notificationQueue) {
      await showNotification(notification);
      const displayDuration = (settings.customize?.display_duration || 5) * 1000;
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
   * @param {object} notification - The notification object from the queue.
   */
  function showNotification(notification) {
    return new Promise(async resolve => {
      // If a notification is already visible, hide it before showing the next one.
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

      // Add event listeners
      if (notification.data.product_url) {
        notificationEl.style.cursor = "pointer";
        notificationEl.addEventListener("click", () => handleNotificationClick(notification));
      }
      const closeBtn = notificationEl.querySelector(".surftrust-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", e => {
          e.stopPropagation();
          hideNotification();
        });
      }

      // Trigger the animation
      setTimeout(() => {
        notificationEl.classList.add("is-visible");
        trackEvent("view", notification);
        resolve();
      }, 100); // Small delay to allow CSS transitions to work
    });
  }

  /**
   * Hides and removes the currently visible notification.
   */
  function hideNotification() {
    return new Promise(resolve => {
      if (currentNotificationElement) {
        const el = currentNotificationElement;
        el.classList.remove("is-visible");
        // Wait for the fade-out animation to finish before removing
        setTimeout(() => {
          el.remove();
          // Ensure we don't try to remove an element that was already removed
          if (currentNotificationElement === el) {
            currentNotificationElement = null;
          }
          resolve();
        }, 500); // This should match the transition duration in the CSS
      } else {
        resolve();
      }
    });
  }

  /**
   * Generates the inner HTML for a notification based on its type.
   * @param {object} notification - The notification object.
   * @returns {string} The HTML string.
   */
  function renderNotificationHTML(notification) {
    const {
      type,
      data
    } = notification;
    let message = "";
    let meta = data.time_ago || "";
    let imageUrl = data.product_image_url || null;
    switch (type) {
      case "sale":
        message = settings.sales_notification?.message || "{product_name} was just purchased!";
        message = message.replace("{product_name}", `<strong>${data.product_name}</strong>`);
        message = message.replace("{first_name}", data.customer_name || "Someone");
        message = message.replace("{city}", data.city || "somewhere");
        break;
      case "review":
        message = `<strong>${data.reviewer_name || "Someone"}</strong> left a ${data.rating}-star review for <strong>${data.product_name}</strong>!`;
        break;
      //stock
      case "stock":
        message = `Hurry! Only <strong>${data.stock_count}</strong> of <strong>${data.product_name}</strong> left in stock!`;
        meta = "Limited stock available";
        break;
      default:
        return "";
      // Don't render unknown types
    }
    const closeBtnHtml = settings.customize?.show_close_button ? '<button class="surftrust-close-btn">&times;</button>' : "";
    const imageHtml = imageUrl ? `<div class="surftrust-image"><img src="${imageUrl}" alt="${data.product_name}"></div>` : "";
    return `
            <div class="surftrust-notification-wrapper">
                ${closeBtnHtml}
                ${imageHtml}
                <div class="surftrust-content">
                    <p>${message}</p>
                    <p class="meta">${meta}</p>
                </div>
            </div>
        `;
  }

  /**
   * Applies dynamic styles from settings to the notification element.
   * @param {HTMLElement} el - The notification element.
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

    // Add position and animation classes
    const position = settings.sales_notification?.position || "bottom-left";
    el.classList.add(`surftrust-position-${position}`);
    el.classList.add(`surftrust-animation-${customize.animation_style || "fade"}`);
  }

  // --- 5. ANALYTICS TRACKING ---
  function handleNotificationClick(notification) {
    trackEvent("click", notification);
    if (notification.data.product_url) {
      window.location.href = notification.data.product_url;
    }
  }
  function trackEvent(eventType, notification) {
    const payload = {
      notification_type: notification.type,
      product_id: notification.data.product_id || 0
    };
    fetch(`${apiUrl}/track/${eventType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).catch(err => console.error(`Surftrust: Failed to track ${eventType}`, err));
  }

  // --- 6. HELPER FUNCTIONS ---
  /**
   * Shuffles an array in place.
   * @param {Array} array The array to shuffle.
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * A helper to wait for a specific amount of time.
   * @param {number} ms - The number of milliseconds to wait.
   */
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
})();