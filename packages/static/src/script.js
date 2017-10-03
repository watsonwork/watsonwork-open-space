const spaceId = window._properties.space.id;

document.addEventListener('DOMContentLoaded', () => {
    const email = document.querySelector('input[type=email]');
    const join = document.querySelector('input[type=submit]');
    const root = document.getElementById('root');

    function submit() {
        join.value = 'Joining...';

        // Safari does not support window.fetch

        //window.fetch('/api/join', {
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'application/json'
        //    },
        //    body: JSON.stringify({
        //        space: spaceId,
        //        email: email.value
        //    })
        //}).then(res => {
        //    console.log('API response:', res);
        //    if (res.status === 200 || res.status === 201) {
        //        root.className = 'state-success';
        //    } else {
        //        root.className = 'state-error';
        //    }
        //});

        var req = new XMLHttpRequest();

        req.open('POST', '/api/join');
        req.setRequestHeader('Content-Type', 'application/json');

        req.addEventListener('load', res => {
            console.log('Request:', req);

            if (req.status === 200 || req.status === 201) {
                root.className = 'state-success';
            } else {
                root.className = 'state-error';
            }
        });

        req.send(JSON.stringify({
            space: spaceId,
            email: email.value
        }));
    }

    email.addEventListener('keypress', evt => {
        if ((evt.key + '').toLowerCase() === 'enter') {
            submit();
        }
    });

    join.addEventListener('click', submit);
});
