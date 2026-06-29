// Shared script for toggling the left menu and handling star animation
function toggleMenu() {
    const drawer = document.getElementById('menuDrawer');
    const overlay = document.getElementById('menuOverlay');
    const button = document.querySelector('.logo-wrapper');
    const isOpen = drawer.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    button && button.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
}

// Ensure menu state is correct on load for desktop
document.addEventListener('DOMContentLoaded', () => {
    const drawer = document.getElementById('menuDrawer');
    const overlay = document.getElementById('menuOverlay');
    // do not auto-open on desktop; start closed and let user toggle via logo
    // start particles and stats when present
    try { spawnParticles(); } catch (e) {}
    try { updateDiscordStats(); } catch (e) {}
});

// Close drawer when overlay clicked (in case some pages still have inline onclicks)
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('menuOverlay');
    if (!overlay) return;
    if (e.target === overlay) toggleMenu();
});

// Discord stats fetcher (safe if elements are missing)
const discordWidgetUrl = 'https://discord.com/api/v10/invites/pQHX366wWW?with_counts=true';
async function updateDiscordStats() {
    try {
        const resp = await fetch(discordWidgetUrl);
        if (!resp.ok) return;
        const data = await resp.json();
        const total = data.approximate_member_count || data.approximate_member_count === 0 ? data.approximate_member_count : null;
        const online = data.approximate_presence_count || data.approximate_presence_count === 0 ? data.approximate_presence_count : null;
        const totalEl = document.getElementById('totalMembers');
        const onlineEl = document.getElementById('onlineMembers');
        if (totalEl && total != null) totalEl.textContent = total;
        if (onlineEl && online != null) onlineEl.textContent = online;
    } catch (e) {
        console.warn('Discord stats not available', e);
    }
}

// Simple particle spawner for background flair
function spawnParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    // clear existing
    container.innerHTML = '';
    for (let i=0;i<10;i++){
        const p = document.createElement('div'); p.className='particle';
        const size = 6 + Math.random()*24;
        p.style.width = size+'px'; p.style.height = size+'px';
        p.style.left = (Math.random()*110 - 5)+'%';
        p.style.top = (Math.random()*110 - 5)+'%';
        p.style.opacity = 0.05 + Math.random()*0.15;
        container.appendChild(p);
        const dur = 14000 + Math.random()*22000;
        const tx = (Math.random()*120-60);
        const ty = -900 - Math.random()*400;
        p.animate([
            { transform: 'translate3d(0,0,0) scale(0.6)', opacity: p.style.opacity },
            { transform: `translate3d(${tx}px, ${ty}px, 0) scale(1.2)`, opacity: 0 }
        ], { duration: dur, iterations: Infinity, delay: Math.random()*-dur });
    }
}
