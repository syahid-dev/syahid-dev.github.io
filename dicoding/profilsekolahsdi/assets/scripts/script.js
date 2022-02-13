(function () {
    /* Efek animasi */
    function animate() {
        let curpos = document.scrollingElement.scrollTop || document.documentElement.scrollTop,
            navheight = document.querySelector(".navbar").scrollHeight;
        curpos = curpos - navheight < 0 ? 0 : curpos - navheight;
        document.querySelectorAll("[data-animate]").forEach(elm => {
            if (
                ((elm.offsetTop - navheight) + elm.scrollHeight) > curpos
            &&  (elm.offsetTop - navheight) < (curpos + (window.innerHeight || document.documentElement.clientHeight))
            )
            {
                elm.classList.add("animate-active");
            }
        });
    }

    animate();

    /* Ketika sedang scroll */
    window.addEventListener("scroll", (e) => {
        let curpos = document.scrollingElement.scrollTop || document.documentElement.scrollTop,
            navheight = document.querySelector(".navbar").scrollHeight,
            n = [];
        document.querySelectorAll('main > section > article[id]').forEach(elm => {
            document.querySelector(`.navbar > ul > li > a[href="#${elm.getAttribute("id")}"]`).parentElement.classList.remove('active');
            n.push([`#${elm.getAttribute("id")}`, elm.offsetTop - navheight < 0 ? 0 : elm.offsetTop - navheight]);
        });
        let terdekat = n.reduce(function (prev, curr) {
            return (Math.abs(curr[1] - curpos) < Math.abs(prev[1] - curpos) ? curr : prev);
        })[0];
        document.querySelector(`.navbar > ul > li > a[href="${terdekat}"]`).parentElement.classList.add("active");

        animate();
    });

    /* Efek animasi ketika link navbar di klik */
    document.querySelectorAll('.navbar > ul > li > a[href^="#"]').forEach(elm => {
        elm.addEventListener("click", function (e) {
            let scrollElm = document.documentElement,
                curpos = scrollElm.scrollTop,
                change = document.querySelector(this.getAttribute("href")).offsetTop - document.querySelector(".navbar").scrollHeight - curpos,
                curtime = 0,
                increment = 20,
                duration = 500;

            let animateScroll = () => {
                curtime += increment;
                let val = function (t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                };
                val = val(curtime, curpos, change, duration);
                scrollElm.scrollTop = val;
                if (curtime < duration) setTimeout(animateScroll, increment);
            };
            animateScroll();

            e.preventDefault();
        });
    });

    /* Tombol showmenu untuk menampilkan menu ketika dilayar HP */
    document.querySelector(".navbar > .showmenu").addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("show");
    });

    /* Hapus attribute onclick pada Form Kontak jika javascript diaktifkan */
    document.querySelector("#kontak > form").removeAttribute("onclick");

    /* Animasi Form Kontak */
    document.querySelector("#kontak > form").addEventListener("submit", function (e) {
        let loading = document.createElement("span");
        loading.classList.add("loading");
        if (!this.querySelector("button[type=submit]").childElementCount) {
            this.querySelector("button[type=submit]").appendChild(loading);
            setTimeout(() => {
                let alert = document.createElement("div");
                alert.classList.add("alert");
                alert.innerHTML = `Selamat! Pesan Anda telah dikirim. <button class="close"><span>&times;</span></button>`;
                alert.querySelector("button.close").addEventListener("click", () => alert.remove());
                this.querySelector("button[type=submit]").innerHTML = "Kirim";
                this.parentElement.insertBefore(alert, this);
            }, (1000 / (document.querySelectorAll("div.alert").length ? document.querySelectorAll("div.alert").length : 1)) < 0 ? 0 : 1000 / (document.querySelectorAll("div.alert").length ? document.querySelectorAll("div.alert").length : 1));
        }
        e.preventDefault();
    })
})();