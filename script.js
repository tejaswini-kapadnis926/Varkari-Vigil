const appState = {
    pilgrims: 128450,
    crowdDensity: 68,
    healthRisk: 42,
    temperature: 29,
    warnings: 3,
    currentZone: "Wakhri",

    zones: {
        "Wakhri": {
            crowd: 72,
            risk: 48,
            temperature: 29,
            medical: 31,
            water: 76
        },

        "Chandrabhaga Ghat": {
            crowd: 88,
            risk: 74,
            temperature: 30,
            medical: 45,
            water: 61
        },

        "Vitthal-Rukmini Temple": {
            crowd: 91,
            risk: 82,
            temperature: 29,
            medical: 57,
            water: 58
        },

        "Palkhi Route — Malshiras": {
            crowd: 64,
            risk: 39,
            temperature: 28,
            medical: 22,
            water: 82
        }
    }
};

const baseZoneMetrics = JSON.parse(JSON.stringify(appState.zones));

/* =========================================
   START APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    updateClock();

    setInterval(updateClock, 1000);

    setupNavigation();

    setupHeroButton();

    setupNotifications();

    setupActivityFeed();

    setupRiskMap();

    setupAI();

    setupWariDate();

    setupHybridVisuals();

    startLiveUpdates();

});


/* Daily Wari demo snapshots. Values are illustrative, not official/live measurements. */
const wariDailySnapshots = {
    "2026-07-07": { pilgrims:18500, crowdDensity:24, healthRisk:18, temperature:27, warnings:1, zone:"Dehu" },
    "2026-07-08": { pilgrims:26400, crowdDensity:29, healthRisk:21, temperature:27, warnings:1, zone:"Alandi" },
    "2026-07-09": { pilgrims:35200, crowdDensity:33, healthRisk:23, temperature:28, warnings:1, zone:"Pune" },
    "2026-07-10": { pilgrims:41800, crowdDensity:37, healthRisk:26, temperature:28, warnings:1, zone:"Pune" },
    "2026-07-11": { pilgrims:49300, crowdDensity:41, healthRisk:29, temperature:28, warnings:2, zone:"Hadapsar" },
    "2026-07-12": { pilgrims:56700, crowdDensity:43, healthRisk:30, temperature:29, warnings:2, zone:"Saswad" },
    "2026-07-13": { pilgrims:63200, crowdDensity:46, healthRisk:32, temperature:29, warnings:2, zone:"Saswad" },
    "2026-07-14": { pilgrims:70400, crowdDensity:48, healthRisk:34, temperature:29, warnings:2, zone:"Jejuri" },
    "2026-07-15": { pilgrims:78200, crowdDensity:52, healthRisk:37, temperature:29, warnings:2, zone:"Jejuri" },
    "2026-07-16": { pilgrims:85600, crowdDensity:55, healthRisk:39, temperature:30, warnings:2, zone:"Lonand" },
    "2026-07-17": { pilgrims:92400, crowdDensity:58, healthRisk:41, temperature:30, warnings:3, zone:"Lonand" },
    "2026-07-18": { pilgrims:100200, crowdDensity:61, healthRisk:43, temperature:29, warnings:3, zone:"Phaltan" },
    "2026-07-19": { pilgrims:108500, crowdDensity:64, healthRisk:46, temperature:29, warnings:3, zone:"Malshiras" },
    "2026-07-20": { pilgrims:116200, crowdDensity:66, healthRisk:47, temperature:29, warnings:3, zone:"Malshiras" },
    "2026-07-21": { pilgrims:123400, crowdDensity:69, healthRisk:49, temperature:30, warnings:3, zone:"Velapur" },
    "2026-07-22": { pilgrims:131600, crowdDensity:72, healthRisk:53, temperature:30, warnings:4, zone:"Velapur" },
    "2026-07-23": { pilgrims:139800, crowdDensity:76, healthRisk:58, temperature:30, warnings:4, zone:"Wakhri" },
    "2026-07-24": { pilgrims:148600, crowdDensity:84, healthRisk:69, temperature:31, warnings:6, zone:"Pandharpur" },
    "2026-07-25": { pilgrims:156800, crowdDensity:91, healthRisk:82, temperature:31, warnings:8, zone:"Vitthal-Rukmini Temple" },
    "2026-07-26": { pilgrims:142300, crowdDensity:82, healthRisk:70, temperature:30, warnings:6, zone:"Pandharpur" },
    "2026-07-27": { pilgrims:119500, crowdDensity:70, healthRisk:55, temperature:29, warnings:4, zone:"Pandharpur" },
    "2026-07-28": { pilgrims:94800, crowdDensity:58, healthRisk:43, temperature:29, warnings:3, zone:"Pandharpur" },
    "2026-07-29": { pilgrims:71800, crowdDensity:46, healthRisk:33, temperature:28, warnings:2, zone:"Pandharpur" },
    "2026-07-30": { pilgrims:52600, crowdDensity:35, healthRisk:25, temperature:28, warnings:1, zone:"Pandharpur" }
};
let selectedWariDate = "2026-07-25";
let isHistoricalWariDate = true;

function setupWariDate() {
    const picker = document.getElementById("wariDate");
    if (!picker) return;
    picker.value = selectedWariDate;
    applyWariDate(selectedWariDate);
    picker.addEventListener("change", () => {
        if (!wariDailySnapshots[picker.value]) {
            showToast("Choose a date from 7–30 July 2026");
            picker.value = selectedWariDate;
            return;
        }
        selectedWariDate = picker.value;
        isHistoricalWariDate = true;
        applyWariDate(selectedWariDate);
    });
}
function applyWariDate(date) {
    const data = wariDailySnapshots[date];
    if (!data) return;
    Object.assign(appState, {
        pilgrims:data.pilgrims, crowdDensity:data.crowdDensity,
        healthRisk:data.healthRisk, temperature:data.temperature,
        warnings:data.warnings, currentZone:data.zone
    });

    // Scale each zone's demo metrics to the selected day's snapshot.
    Object.entries(appState.zones).forEach(([name, zone]) => {
        const base = baseZoneMetrics[name];
        zone.crowd = Math.min(99, Math.max(10, Math.round(data.crowdDensity * (base.crowd / 68))));
        zone.risk = Math.min(99, Math.max(5, Math.round(data.healthRisk * (base.risk / 42))));
        zone.temperature = data.temperature;
        zone.medical = Math.min(99, Math.max(5, Math.round(data.healthRisk * (base.medical / 42))));
        zone.water = Math.min(99, Math.max(5, Math.round(100 - data.crowdDensity * ((100 - base.water) / 32))));
    });
    updateKPI();
    const label = document.getElementById("selectedWariDateLabel");
    if (label) label.textContent = new Date(date + "T12:00:00").toLocaleDateString("en-IN",
        {weekday:"short", day:"2-digit", month:"short", year:"numeric"});
    const mode = document.getElementById("wariDataMode");
    if (mode) mode.textContent = "Illustrative demo snapshot";
    showToast("Loaded demo data for " + new Date(date + "T12:00:00").toLocaleDateString("en-IN",
        {day:"numeric", month:"short", year:"numeric"}));
}

/* =========================================
   LIVE CLOCK
========================================= */

function updateClock() {

    const clock = document.querySelector(".clock");

    if (!clock) return;

    const now = new Date();

    clock.textContent = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}


/* =========================================
   NAVIGATION
========================================= */

function setupNavigation() {

    const navItems = document.querySelectorAll(".nav-item");
    const pageSections = document.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("pageTitle");

    function showPage(pageId, clickedItem = null) {
        const target = document.getElementById(pageId);
        if (!target) return;

        // Hide every page and show only the selected page.
        pageSections.forEach(section => {
            section.classList.toggle("active", section.id === pageId);
        });

        // Keep the sidebar active state synchronized with the selected page.
        navItems.forEach(nav => {
            nav.classList.toggle("active", nav.dataset.page === pageId);
        });

        // Update the top-bar page title to match the selected section.
        if (pageTitle) {
            const activeNav = clickedItem || document.querySelector(`.nav-item[data-page="${pageId}"]`);
            const label = activeNav?.querySelector("span:last-child")?.textContent?.trim();
            pageTitle.textContent = label || pageId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        }

        // Keep the URL/hash in sync without reloading the local HTML file.
        if (window.location.hash !== `#${pageId}`) {
            history.replaceState(null, "", `#${pageId}`);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    navItems.forEach(item => {
        item.addEventListener("click", function(event) {
            event.preventDefault();
            showPage(this.dataset.page, this);

            const text = this.querySelector("span:last-child");
            if (text) showToast(text.textContent.trim());
        });
    });

    // Internal cards/actions that point to another page use data-page-link.
    document.querySelectorAll("[data-page-link]").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            showPage(this.dataset.pageLink);
        });
    });

    // Restore the selected page when a hash is present, otherwise keep Overview.
    const initialPage = window.location.hash.replace("#", "");
    if (initialPage && document.getElementById(initialPage)) {
        showPage(initialPage);
    } else {
        showPage("overview");
    }
}


/* =========================================
   HERO BUTTON
========================================= */

function setupHeroButton() {
    const button = document.getElementById("exploreLiveWari");
    const liveWari = document.querySelector('[data-page="live-wari"]');

    if (!button || !liveWari) return;

    button.addEventListener("click", () => {
        liveWari.click();
    });
}


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message) {

    const oldToast =
        document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
        <strong>${message}</strong>
        <small>Module selected</small>
    `;

    document.body.appendChild(toast);

    Object.assign(toast.style, {
        position: "fixed",
        right: "25px",
        bottom: "25px",
        zIndex: "9999",
        padding: "13px 18px",
        borderRadius: "10px",
        background: "#0d1a17",
        border: "1px solid rgba(244,163,64,0.3)",
        color: "#f4f6ef",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
        fontSize: "11px"
    });

    const small = toast.querySelector("small");

    small.style.display = "block";
    small.style.color = "#82918b";
    small.style.marginTop = "4px";

    setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transition = "0.3s";

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 1800);
}


/* =========================================
   NOTIFICATIONS
========================================= */

function setupNotifications() {

    const button =
        document.querySelector(".notification");

    if (!button) return;

    button.addEventListener("click", () => {

        const existing =
            document.querySelector(".notification-panel");

        if (existing) {
            existing.remove();
            return;
        }

        const panel =
            document.createElement("div");

        panel.className =
            "notification-panel";

        panel.innerHTML = `

            <div class="notification-header">
                <strong>LIVE ALERTS</strong>
                <span>${appState.warnings} active</span>
            </div>

            <div class="notification-item">
                <strong>High Crowd Density</strong>
                <small>Vitthal-Rukmini Temple</small>
            </div>

            <div class="notification-item">
                <strong>Heat Risk Increasing</strong>
                <small>Chandrabhaga Ghat</small>
            </div>

            <div class="notification-item">
                <strong>Medical Team Ready</strong>
                <small>Field Medical Camp</small>
            </div>
        `;

        document.body.appendChild(panel);

        Object.assign(panel.style, {
            position: "fixed",
            top: "75px",
            right: "25px",
            width: "280px",
            padding: "16px",
            borderRadius: "14px",
            background: "#0d1a17",
            border: "1px solid rgba(255,255,255,0.1)",
            zIndex: "9999",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
        });

        panel.querySelectorAll(
            ".notification-item"
        ).forEach(item => {

            item.style.padding = "12px 0";
            item.style.borderTop =
                "1px solid rgba(255,255,255,0.06)";

            const small =
                item.querySelector("small");

            small.style.display = "block";
            small.style.color = "#82918b";
            small.style.marginTop = "4px";
        });
    });
}


/* =========================================
   ACTIVITY FEED
========================================= */

function setupActivityFeed() {

    const button = document.querySelector("#viewAllSignals");

    if (!button) return;

    button.addEventListener("click", () => {

        showModal(
            "All Live Signals",
            `
            <div class="signal-modal-list">
                <p><strong>🔴 Crowd pressure detected</strong><br><span>Chandrabhaga Ghat · 2 min ago</span></p>
                <p><strong>🟡 Hydration demand rising</strong><br><span>Wakhri Zone · 7 min ago</span></p>
                <p><strong>🟢 Medical unit available</strong><br><span>Route Sector 04 · 11 min ago</span></p>
                <p><strong>🔵 Wari movement detected</strong><br><span>Malshiras Route · 16 min ago</span></p>
                <p><strong>🟡 Heat stress monitoring active</strong><br><span>Pandharpur sector · 19 min ago</span></p>
                <p><strong>🟢 Water supply check completed</strong><br><span>Wakhri Zone · 23 min ago</span></p>
            </div>
            `
        );
    });
}


/* =========================================
   RISK MAP
========================================= */

function setupRiskMap() {

    const zones =
        document.querySelectorAll(".zone");

    zones.forEach(zone => {

        zone.addEventListener("click", () => {

            let zoneName =
                zone.dataset.zone;

            if (!zoneName) {

                if (zone.classList.contains("one")) {
                    zoneName = "Wakhri";
                }

                else if (
                    zone.classList.contains("two")
                ) {
                    zoneName = "Chandrabhaga Ghat";
                }

                else if (
                    zone.classList.contains("three")
                ) {
                    zoneName =
                        "Vitthal-Rukmini Temple";
                }

                else if (
                    zone.classList.contains("four")
                ) {
                    zoneName =
                        "Palkhi Route — Malshiras";
                }
            }

            showZoneDetails(zoneName);
        });
    });
}


/* =========================================
   ZONE DETAILS
========================================= */

function showZoneDetails(zoneName) {

    const zone =
        appState.zones[zoneName];

    if (!zone) {

        showModal(
            "Zone Information",
            "Live information is not available for this zone."
        );

        return;
    }

    appState.currentZone = zoneName;

    let status = "STABLE";

    if (zone.risk >= 80) {
        status = "CRITICAL";
    }

    else if (zone.risk >= 60) {
        status = "WATCH";
    }

    let recommendation =
        "Continue routine monitoring.";

    if (zone.risk >= 80) {

        recommendation =
            "Deploy additional medical and crowd-control resources.";
    }

    else if (zone.risk >= 60) {

        recommendation =
            "Increase monitoring and prepare nearby response teams.";
    }

    showModal(
        zoneName,

        `
        <div>

            <p>
                <strong>Crowd Density:</strong>
                ${zone.crowd}%
            </p>

            <p>
                <strong>Risk Score:</strong>
                ${zone.risk}/100
            </p>

            <p>
                <strong>Temperature:</strong>
                ${zone.temperature}°C
            </p>

            <p>
                <strong>Medical Load:</strong>
                ${zone.medical}%
            </p>

            <p>
                <strong>Water Availability:</strong>
                ${zone.water}%
            </p>

            <hr>

            <p>
                <strong>VIGIL AI</strong><br>
                ${recommendation}
            </p>

            <p>
                <strong>Status:</strong> ${status}
            </p>

        </div>
        `
    );
}


/* =========================================
   FULL MAP VIEW
========================================= */

function openFullMap() {

    const sourceMap = document.querySelector(".main-grid .map");

    if (!sourceMap) return;

    const mapCopy = sourceMap.cloneNode(true);

    mapCopy.classList.add("full-map-display");

    showModal(
        "Live Wari Situation — Full Map",
        `
        <p class="full-map-intro">
            Live geospatial view of the monitored Wari route,
            risk zones and current situation points.
        </p>
        ${mapCopy.outerHTML}
        `
    );

    const modal = document.querySelector(".custom-modal");
    const box = modal ? modal.querySelector(".modal-box") : null;

    if (box) {
        box.classList.add("full-map-modal-box");
    }
}


/* =========================================
   MODAL
========================================= */

function showModal(title, content) {

    const old =
        document.querySelector(".custom-modal");

    if (old) {
        old.remove();
    }

    const modal =
        document.createElement("div");

    modal.className =
        "custom-modal";

    modal.innerHTML = `

        <div class="modal-overlay">

            <div class="modal-box">

                <button class="modal-close">
                    ×
                </button>

                <small>VARKARI VIGIL</small>

                <h2>${title}</h2>

                <div class="modal-content">
                    ${content}
                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    const overlay =
        modal.querySelector(".modal-overlay");

    const box =
        modal.querySelector(".modal-box");

    const close =
        modal.querySelector(".modal-close");

    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "10000"
    });

    Object.assign(box.style, {
        position: "relative",
        width: "500px",
        maxWidth: "90%",
        padding: "28px",
        borderRadius: "18px",
        background: "#0d1a17",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#f4f6ef"
    });

    close.addEventListener("click", () => {
        modal.remove();
    });

    overlay.addEventListener("click", event => {

        if (event.target === overlay) {
            modal.remove();
        }

    });
}


/* =========================================
   AI ASSISTANT
========================================= */

function setupAI() {

    const aiButtons = document.querySelectorAll('[data-ai]');

    aiButtons.forEach(button => {

        button.addEventListener('click', function (event) {
            event.preventDefault();
            openAI();
        });

        button.addEventListener('keydown', function (event) {

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openAI();
            }

        });

    });

}

/* =========================================
   OPEN AI
========================================= */

function openAI() {

    const existing =
        document.querySelector(".ai-assistant");

    if (existing) {

        existing.remove();

        return;
    }

    const assistant =
        document.createElement("div");

    assistant.className =
        "ai-assistant";

    assistant.innerHTML = `

        <div class="ai-header">

            <div>
                <small>VIGIL AI</small>
                <strong>Safety Assistant</strong>
            </div>

            <button class="ai-close">
                ×
            </button>

        </div>

        <div class="ai-message">

            <strong>System Status: SAFE</strong>

            <p>
                Current overall risk:
                ${appState.healthRisk}/100
            </p>

        </div>

        <div class="ai-actions">

            <button data-action="crowd">
                Check Crowd
            </button>

            <button data-action="medical">
                Prepare Medical Team
            </button>

            <button data-action="water">
                Check Water
            </button>

        </div>

        <div class="ai-input">

            <input
                type="text"
                placeholder="Ask anything about the Wari..."
            >

            <button>
                →
            </button>

        </div>

        <div class="ai-response"></div>

    `;

    document.body.appendChild(assistant);

    Object.assign(assistant.style, {
        position: "fixed",
        left: "24px",
        bottom: "94px",
        width: "340px",
        maxWidth: "calc(100vw - 40px)",
        padding: "18px",
        borderRadius: "18px",
        background: "#0d1a17",
        border: "1px solid rgba(244,163,64,0.25)",
        zIndex: "10001",
        boxShadow: "0 25px 80px rgba(0,0,0,0.5)"
    });

    assistant
        .querySelector(".ai-close")
        .addEventListener("click", () => {
            assistant.remove();
        });

    setupAIActions(assistant);
}


/* =========================================
   AI ACTION BUTTONS
========================================= */

function setupAIActions(assistant) {

    const buttons =
        assistant.querySelectorAll(
            ".ai-actions button"
        );

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const action =
                button.dataset.action;

            let response = "";

            if (action === "crowd") {

                response =
                    `Current average crowd density is ${appState.crowdDensity}%. High-density zones should be monitored closely.`;
            }

            if (action === "medical") {

                response =
                    "Recommendation: keep an additional medical response team ready near high-risk zones.";
            }

            if (action === "water") {

                response =
                    "Water availability should be checked first at high-density rest and gathering zones.";
            }

            displayAIResponse(
                assistant,
                response
            );
        });
    });


    const input =
        assistant.querySelector("input");

    const send =
        assistant.querySelector(
            ".ai-input button"
        );

    send.addEventListener("click", () => {

        answerQuestion(
            assistant,
            input.value
        );

        input.value = "";

    });


    input.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            answerQuestion(
                assistant,
                input.value
            );

            input.value = "";
        }

    });
}


/* =========================================
   AI QUESTION PROCESSOR
========================================= */

function answerQuestion(
    assistant,
    question
) {

    if (!question.trim()) return;

    const text = question.toLowerCase().trim();
    const selectedLabel = new Date(selectedWariDate + "T12:00:00").toLocaleDateString("en-IN", {
        weekday:"long", day:"numeric", month:"long", year:"numeric"
    });
    const zone = appState.currentZone || "Pandharpur Wari route";
    const heatIndex = Math.round(appState.temperature + (appState.crowdDensity * 0.045));

    let answer = "";

    /* Marathi questions */
    if (/[\u0900-\u097F]/.test(text)) {
        if (text.includes("उष्ण") || text.includes("तापमान") || text.includes("हवामान")) {
            answer = `निवडलेल्या ${selectedLabel} साठी मॉनिटर केलेले तापमान ${appState.temperature}°C आहे. अंदाजे उष्णता निर्देशांक ${heatIndex} आहे. अधिक गर्दीच्या भागात उष्णतेचा धोका वाढू शकतो.`;
        } else if (text.includes("गर्दी") || text.includes("लोक")) {
            answer = `${selectedLabel} रोजी अंदाजे गर्दी घनता ${appState.crowdDensity}% आहे. सध्या ${zone} हा मुख्य मॉनिटरिंग झोन आहे.`;
        } else if (text.includes("धोका") || text.includes("जोखीम")) {
            answer = `${selectedLabel} रोजी एकूण आरोग्य व सुरक्षा जोखीम ${appState.healthRisk}/100 आहे. सक्रिय इशारे ${appState.warnings} आहेत.`;
        } else if (text.includes("वार") || text.includes("वारी") || text.includes("पंढरपूर")) {
            answer = `विठ्ठल विठ्ठल जय हरी विठ्ठल 🙏 — Varkari Vigil सध्या ${selectedLabel} साठी वारीची स्थिती दाखवत आहे. सुमारे ${appState.pilgrims.toLocaleString("en-IN")} वारकरी मॉनिटर केले जात आहेत.`;
        } else {
            answer = `Varkari Vigil च्या सध्याच्या डेटानुसार ${selectedLabel} रोजी ${appState.pilgrims.toLocaleString("en-IN")} वारकरी, ${appState.crowdDensity}% गर्दी घनता आणि ${appState.healthRisk}/100 जोखीम आहे. तुम्ही वारीतील गर्दी, हवामान, आरोग्य, पाणी, मार्ग, दिंडी, विश्रांती किंवा आपत्कालीन परिस्थितीबद्दल विचारू शकता.`;
        }
    }

    /* Date / day questions */
    else if (text.includes("date") || text.includes("which day") || text.includes("selected day") || text.includes("today")) {
        answer = `The dashboard is currently showing ${selectedLabel}. This is the selected 2026 Wari data view. It contains ${appState.pilgrims.toLocaleString("en-IN")} monitored Warkaris, ${appState.crowdDensity}% crowd density, ${appState.temperature}°C temperature and ${appState.warnings} active warnings.`;
    }

    /* Heat / weather */
    else if (text.includes("heat") || text.includes("hot") || text.includes("temperature") || text.includes("weather") || text.includes("rain") || text.includes("humidity") || text.includes("climate")) {
        answer = `For ${selectedLabel}, the monitored temperature is ${appState.temperature}°C. Based on the current demonstration indicators, the estimated heat index is ${heatIndex}. Higher crowd density can increase heat-stress risk, so hydration and shaded rest areas should be prioritised.`;
    }

    /* Crowd / footfall */
    else if (text.includes("crowd") || text.includes("people") || text.includes("pilgrim") || text.includes("warkari") || text.includes("footfall") || text.includes("density")) {
        answer = `For ${selectedLabel}, Varkari Vigil is monitoring approximately ${appState.pilgrims.toLocaleString("en-IN")} Warkaris. Overall crowd density is ${appState.crowdDensity}%, with ${zone} currently marked as the main monitoring zone.`;
    }

    /* Health / medical */
    else if (text.includes("health") || text.includes("medical") || text.includes("dehydration") || text.includes("heat stroke") || text.includes("injur") || text.includes("doctor") || text.includes("ambulance")) {
        answer = `The current health and safety risk is ${appState.healthRisk}/100. Vigil AI recommends keeping medical response capacity ready around high-density zones and prioritising elderly pilgrims, dehydration cases and heat-stress symptoms.`;
    }

    /* Risk / prediction */
    else if (text.includes("risk") || text.includes("danger") || text.includes("safe") || text.includes("predict") || text.includes("forecast")) {
        const level = appState.healthRisk >= 75 ? "HIGH" : appState.healthRisk >= 50 ? "WATCH" : "STABLE";
        answer = `The current Wari safety risk is ${appState.healthRisk}/100 (${level}). The main factors represented in this dashboard are crowd density, heat conditions, medical load and resource pressure. There are currently ${appState.warnings} active warnings.`;
    }

    /* Route / location / places */
    else if (text.includes("where") || text.includes("route") || text.includes("location") || text.includes("wakhri") || text.includes("chandrabhaga") || text.includes("pandharpur") || text.includes("temple") || text.includes("ghat") || text.includes("malshiras") || text.includes("station")) {
        answer = `The dashboard is currently focused on ${zone}. Varkari Vigil monitors key Wari locations including Wakhri, Chandrabhaga Ghat, Vitthal-Rukmini Temple, the Malshiras route, medical camp clusters and the Pandharpur Station approach.`;
    }

    /* Water / food / rest */
    else if (text.includes("water") || text.includes("food") || text.includes("rest") || text.includes("accommodation") || text.includes("toilet") || text.includes("charging") || text.includes("camp")) {
        answer = `Resource availability is monitored across the Wari support network. Current priority is to maintain water, food, toilets, charging and medical support near high-density areas. The selected-day water indicators are used to highlight locations that may need replenishment.`;
    }

    /* Volunteers / seva */
    else if (text.includes("volunteer") || text.includes("seva") || text.includes("help") || text.includes("staff")) {
        answer = `Vigil AI uses the current risk and crowd situation to suggest where volunteer and Seva teams should be concentrated. High-density or high-risk zones should receive priority for crowd guidance, hydration support and incident reporting.`;
    }

    /* Dindi / lost & found */
    else if (text.includes("dindi") || text.includes("lost") || text.includes("missing") || text.includes("found") || text.includes("family") || text.includes("separate")) {
        answer = `Varkari Vigil includes Dindi tracking and Lost & Found as safety-support modules. These modules are intended to help monitor group movement and assist with reunification workflows. In this frontend demo, those readings are illustrative until connected to real operational data.`;
    }

    /* Alerts / emergency */
    else if (text.includes("alert") || text.includes("warning") || text.includes("emergency") || text.includes("incident") || text.includes("evacuat") || text.includes("fire") || text.includes("accident")) {
        answer = `There are currently ${appState.warnings} active warnings in the selected ${selectedLabel} view. Emergency response should prioritise the highest-risk zones, maintain medical access routes and use volunteers to prevent dangerous crowd concentration.`;
    }

    /* Reports / dashboard / system */
    else if (text.includes("report") || text.includes("dashboard") || text.includes("system") || text.includes("how does") || text.includes("what is varkari vigil")) {
        answer = `Varkari Vigil is a predictive Wari health-and-safety decision-support platform. It combines crowd, heat, health, resource and location indicators to help teams MONITOR → ANALYSE → PREDICT → ALERT → ACT. The current frontend uses illustrative demo data and can later be connected to a real backend, sensors, APIs and ML model.`;
    }

    /* Generic fallback: still answer using the current Wari context rather than rejecting the question. */
    else {
        answer = `For ${selectedLabel}, here is the current Varkari Vigil situation: approximately ${appState.pilgrims.toLocaleString("en-IN")} Warkaris are being monitored, crowd density is ${appState.crowdDensity}%, temperature is ${appState.temperature}°C, overall safety risk is ${appState.healthRisk}/100, and ${appState.warnings} warnings are active. ${zone} is the current focus area. I can use this Wari context to answer questions about the route, crowd, weather, heat, health, medical support, water, rest camps, volunteers, Dindis, alerts, emergencies, reports and the selected date.`;
    }

    displayAIResponse(assistant, answer);
}

/* =========================================
   DISPLAY AI RESPONSE
========================================= */

function displayAIResponse(
    assistant,
    response
) {

    const box =
        assistant.querySelector(
            ".ai-response"
        );

    box.textContent = response;

    box.style.marginTop = "12px";
    box.style.padding = "12px";
    box.style.borderRadius = "9px";
    box.style.background =
        "rgba(69,199,180,0.06)";
    box.style.color = "#aebbb5";
    box.style.fontSize = "9px";
    box.style.lineHeight = "1.6";
}


/* =========================================
   LIVE DATA SIMULATION
========================================= */

function startLiveUpdates() {

    setInterval(() => {

        if (isHistoricalWariDate) return;

        appState.pilgrims +=
            randomNumber(-20, 80);

        appState.crowdDensity =
            clamp(
                appState.crowdDensity +
                randomNumber(-2, 2),
                20,
                98
            );

        appState.healthRisk =
            clamp(
                appState.healthRisk +
                randomNumber(-2, 2),
                10,
                95
            );

        appState.temperature =
            clamp(
                appState.temperature +
                randomNumber(-1, 1),
                24,
                36
            );

        updateKPI();

    }, 5000);
}


/* =========================================
   UPDATE KPI CARDS
========================================= */

function updateKPI() {
    const pilgrims = document.getElementById("overviewPilgrimsValue");
    const crowd = document.getElementById("overviewCrowdValue") ||
                  document.getElementById("crowdValue");
    const heat = document.getElementById("overviewHeatValue");
    const alerts = document.getElementById("overviewAlertsValue");

    if (pilgrims) pilgrims.textContent = formatNumber(appState.pilgrims);
    if (crowd) crowd.innerHTML = `${appState.crowdDensity}<small>%</small>`;
    if (heat) heat.innerHTML = `${appState.temperature}<small>°C</small>`;
    if (alerts) alerts.textContent = String(appState.warnings).padStart(2, "0");
}

/* =========================================
   RANDOM NUMBER
========================================= */

function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}


/* =========================================
   LIMIT VALUE
========================================= */

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );
}


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(number) {

    return new Intl.NumberFormat(
        "en-IN"
    ).format(number);
}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;

        const modal =
            document.querySelector(
                ".custom-modal"
            );

        const ai =
            document.querySelector(
                ".ai-assistant"
            );

        const notification =
            document.querySelector(
                ".notification-panel"
            );

        if (modal) modal.remove();

        if (ai) ai.remove();

        if (notification) {
            notification.remove();
        }

    }
);


/* =========================================
   CONSOLE
========================================= */

console.log(
    "VARKARI VIGIL frontend loaded successfully."
);


/* =========================================
   HYBRID VISUAL POLISH
   Decorative effects only; existing module logic is unchanged.
========================================= */
function setupHybridVisuals() {
    const hero = document.querySelector("#overview .hero");
    if (!hero) return;

    // Respect reduced-motion preferences and avoid pointer effects on touch devices.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!reducedMotion && finePointer) {
        hero.addEventListener("pointermove", event => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            // Small CSS-variable shifts create layered depth without moving the full dashboard.
            hero.style.setProperty("--pointer-x", `${(x * 13).toFixed(2)}px`);
            hero.style.setProperty("--pointer-y", `${(y * 9).toFixed(2)}px`);
        });
        hero.addEventListener("pointerleave", () => {
            hero.style.setProperty("--pointer-x", "0px");
            hero.style.setProperty("--pointer-y", "0px");
        });
    }

    // Mark prototype metrics in the document for assistive technology and demo clarity.
    document.querySelectorAll(".live").forEach(status => {
        status.setAttribute("aria-label", "Demo mode: simulated data, not live operational data");
        status.setAttribute("title", "Prototype simulation — not an official live feed");
    });
}
