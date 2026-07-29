export function initClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;
    
    function updateClock() {
        const now = new Date();
        const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        const timeString = now.toLocaleString('en-US', options).replace(',', '');
        clockElement.textContent = timeString;
    }
    
    setInterval(updateClock, 1000);
    updateClock();
}
