document.addEventListener('DOMContentLoaded', () => {
    const email = document.querySelector('input[type=email]');
    const join = document.querySelector('input[type=submit]');
    const root = document.getElementById('root');

    function submit(simulateError) {
        join.value = 'Joining...';

        setTimeout(() => {
            if (!simulateError) {
                root.className = 'state-success';
            } else {
                root.className = 'state-error';
            }
        }, 2000);
    }

    email.addEventListener('keypress', evt => {
        if ((evt.key + '').toLowerCase() !== 'enter') {
            return;
        }

        submit(evt.metaKey);
    });

    join.addEventListener('click', evt => {
        submit(evt.metaKey);
    });
});
