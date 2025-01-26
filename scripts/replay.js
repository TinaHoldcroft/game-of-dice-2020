const replayBtn = document.querySelector('#replayBtn');
if (replayBtn) {
    replayBtn.addEventListener('click', () => history.back());
} else {
    console.warn('Replay button not found on the page.');
}
