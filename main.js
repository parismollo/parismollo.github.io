document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('showTopicsButton');
    const modal = document.getElementById('topicsModal');

    button.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
