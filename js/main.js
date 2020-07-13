var app = new Vue({
    el: '#app',
    data() {
        return {
            houses: [],
            popup: {
                toggle: false,
                locationPopup: false,
                guestsPopup: false,
            },
            locations: {
                cityCountry: [{
                        "city": "Helsinki",
                        "country": "Finland",
                    },
                    {
                        "city": "Turku",
                        "country": "Finland",
                    },
                    {
                        "city": "Oulu",
                        "country": "Finland",
                    },
                    {
                        "city": "Vaasa",
                        "country": "Finland",
                    },
                ],
                locationInput: null,
            },
            guests: {
                guestsInput: 0,
                adults: 0,
                children: 0,
            },
            error: {
                location: false,
                guests: false
            },
            loading: false
        }
    },
    mounted() {
        this.loading = true;
        axios.get('js/stays.json', { timeout: 2000 }).then(response => {
            this.houses = response.data
        })
        this.loading = false;
    },
    watch: {
        guests() {
            this.totalGuests;
        }
    },
    methods: {
        openLocation() {
            this.popup.toggle = this.popup.locationPopup = true;
            this.popup.guestsPopup = false;
        },
        openGuests() {
            this.popup.toggle = this.popup.guestsPopup = true;
            this.popup.locationPopup = false;
        },
        closePopup() {
            this.popup.toggle = this.popup.guestsPopup = this.popup.locationPopup = false;
        },
        increamentBtn() {
            this.increament++;
        },
        decreamentBtn() {
            if (this.decreament === 0) {
                return false;
            }

            this.decreament--;
        },
        locationSelected(item) {
            this.locations.locationInput = item;
        },
        totalGuests() {
            let sum = 0;
            sum = this.guests.adults + this.guests.children;

            this.guests.guestsInput = sum;

            return sum;
        },
        submit() {
            if (this.locations.locationInput === '' || this.locations.locationInput === null) {
                this.error.location = true;
            } else {
                this.error.location = false;
            }

            if (this.guests.guestsInput === 0 || this.guests.guestsInput === null) {
                this.error.guests = true;
            } else {
                this.error.guests = false;
            }

            if (this.error.location === false && this.error.guests === false) {
                this.popup.toggle = false;
                this.loading = true;
                axios.get('js/stays.json', { timeout: 2000 }).then(response => {
                    this.houses = response.data.filter(item => {
                        return this.guests.guestsInput <= item.maxGuests &&
                            item.city.toString().toLowerCase() == this.locations.locationInput.city.toString().toLowerCase() &&
                            item.country.toString().toLowerCase() == this.locations.locationInput.country.toString().toLowerCase()

                    })
                });
                this.loading = false;
            }
        }
    },
})