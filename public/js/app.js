new Vue({
    el: '#app',
    data() {
        return {
            logs: [],
            last_id: null,
            has_next: true,
            loading: true,
            busy: false,
            text: '',
            q: this.getQueryString('q') || '',
            username: '',
            password: '',
            jwtToken: localStorage.getItem('jwtToken')
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        async loadData() {
            if (!this.jwtToken || !this.has_next || this.busy) {
                return;
            }

            this.busy = true

            fetch(`/api/logs?last_id=${this.last_id || ''}&q=${this.q || ''}`, {
                headers: {
                    'Authorization': 'Bearer ' + this.jwtToken
                }
            })
                .then(res => res.json())
                .then(resJSON => {
                    if (resJSON.error == 'Unauthenticated') {
                        localStorage.removeItem('jwtToken');
                        location.reload();
                        return;
                    }
                    
                    this.busy = false
                    this.loading = false

                    if (!resJSON.data || resJSON.data.length == 0) {
                        this.has_next = false
                        return;
                    }

                    this.logs = this.logs.concat(resJSON.data)
                    this.last_id = resJSON.data[resJSON.data.length - 1].id
                })
        },
        login() {
            if (! this.username || ! this.password) {
                return
            }

            fetch(`/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            })
                .then(res => res.json())
                .then(resJSON => {
                    if (resJSON.token) {
                        this.jwtToken = resJSON.token
                        localStorage.setItem('jwtToken', resJSON.token)
                        location.reload();
                        return;
                    }
                })
        },
        onSearch() {
            if (this.q.trim().length === 0) {
                this.q = ''
            }
            this.last_id = null
            this.has_next = true
            this.logs = []
            this.loadData()
            this.updateQueryString('q', this.q)
        },

        async createLog() {
            if (this.text.trim().length === 0) {
                this.text = ''
                return;
            }

            let creating = true
            let time = new Date().getTime()
            let text = this.text
            this.text = ''

            setTimeout(() => {
                if (!creating) {
                    return
                }
                this.logs.unshift({
                    text: text,
                    time: time,
                    created_at: new Date()
                })
            }, 100)

            fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.jwtToken
                },
                body: JSON.stringify({
                    text: text
                })
            })
                .then(res => res.json())
                .then(resJSON => {
                    if (resJSON.error == 'Unauthenticated') {
                        localStorage.removeItem('jwtToken');
                        location.reload();
                        return;
                    }

                    creating = false
                    this.removeLogWithTime(time)
                    if (!resJSON.data) {
                        return;
                    }
                    this.logs.unshift(resJSON.data)     
                })
                .catch(err => {
                    this.removeLogWithTime(time)
                })

        },
        removeLogWithTime(time) {
            for (let i = 0; i < this.logs.length; i++) {
                if (this.logs[i].time == time) {
                    this.logs.splice(i, 1)
                }
            }
        },
        keyup(event, funcName) {
            if (event.which === 13 || event.keyCode === 13 || event.key === "Enter") {
                this[funcName]();
            }
        },
        diffForhuman(dateStr) {
            let inputDate = new Date(dateStr)
            let delta = Math.round((+new Date - inputDate) / 1000);

            let minute = 60,
                hour = minute * 60,
                day = hour * 24,
                week = day * 7;

            var fuzzy = this.formatDate(inputDate);

            if (delta < 30) {
                fuzzy = 'just now';
            } else if (delta < minute) {
                fuzzy = delta + ' seconds ago';
            } else if (delta < 2 * minute) {
                fuzzy = 'a minute ago'
            } else if (delta < hour) {
                fuzzy = Math.floor(delta / minute) + ' minutes ago';
            } else if (Math.floor(delta / hour) == 1) {
                fuzzy = '1 hour ago'
            } else if (delta < day) {
                fuzzy = Math.floor(delta / hour) + ' hours ago';
            } else if (delta < day * 2) {
                fuzzy = 'yesterday';
            }

            return fuzzy
        },
        formatDate(date) {
            return `${date.getFullYear()}-${this.zeroPad(date.getMonth())}-${this.zeroPad(date.getDate())} ${this.zeroPad(date.getHours())}:${this.zeroPad(date.getMinutes())}`
        },
        zeroPad(number) {
            return number < 10 ? `0${number}` : number;
        },
        updateQueryString(key, value) {
            if ('URL' in window) {
                let urlObj = new URL(window.location.href);
                urlObj.searchParams.set(key, value);
                window.history.replaceState({path:urlObj.toString()},'',urlObj.toString());
            }
        },
        getQueryString(key) {
            if ('URL' in window) {
                let urlObj = new URL(window.location.href);
                return urlObj.searchParams.get(key);
            }

            return undefined
        }
    }
})