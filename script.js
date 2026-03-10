window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
        return function (callback, element) {
            var lastTime = element.__lastTime;
            if (lastTime === undefined) { lastTime = 0; }
            var currTime = Date.now();
            var timeToCall = Math.max(1, 33 - (currTime - lastTime));
            window.setTimeout(callback, timeToCall);
            element.__lastTime = currTime + timeToCall;
        };
    })();

window.isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    ((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()
));

var loaded = false;
var init = function () {
    if (loaded) return;
    loaded = true;

    var mobile = window.isDevice;
    var koef = mobile ? 0.5 : 1;
    var canvas = document.getElementById('heart');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = koef * innerWidth;
    var height = canvas.height = koef * innerHeight;
    var rand = Math.random;

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    window.addEventListener('resize', function () {
        width = canvas.width = koef * innerWidth;
        height = canvas.height = koef * innerHeight;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    });

    var heartPosition = function (rad) {
        return [
            Math.pow(Math.sin(rad), 3),
            -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
        ];
    };
    var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    var dr = mobile ? 0.3 : 0.1;
    var pointsOrigin = [];
    for (var i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (var i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (var i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    var heartPointsCount = pointsOrigin.length;
    var targetPoints = [];

    var pulse = function (k) {
        for (var i = 0; i < pointsOrigin.length; i++) {
            targetPoints[i] = [
                k * pointsOrigin[i][0] + width / 2,
                k * pointsOrigin[i][1] + height / 2
            ];
        }
    };

    // Parçacıklar — bordo/kırmızı
    var traceCount = mobile ? 20 : 50;
    var e = [];
    for (var i = 0; i < heartPointsCount; i++) {
        var x = rand() * width;
        var y = rand() * height;
        var hue = rand() > 0.5 ? Math.floor(rand() * 15 + 345) % 360 : Math.floor(rand() * 10);
        var sat = Math.floor(rand() * 30 + 70);
        var lit = Math.floor(rand() * 30 + 15);
        // %18 ihtimalle beyaz/krem parçacık
        var isWhite = rand() < 0.18;
        var particleColor = isWhite
            ? "hsla(0,0%," + Math.floor(rand() * 30 + 70) + "%," + (0.15 + rand() * 0.25).toFixed(2) + ")"
            : "hsla(" + hue + "," + sat + "%," + lit + "%,.35)";
        e[i] = {
            vx: 0, vy: 0,
            speed: rand() + 5,
            q: ~~(rand() * heartPointsCount),
            D: 2 * (i % 2) - 1,
            force: 0.2 * rand() + 0.7,
            f: particleColor,
            trace: []
        };
        for (var k = 0; k < traceCount; k++) e[i].trace[k] = { x: x, y: y };
    }

    // ── Perlin benzeri smooth rastgele ──────────────────────────────────────
    // Birden fazla sinüs dalgasını rastgele faz ve frekanslarla üst üste koy.
    // Sonuç: hiç tekrar etmeyen, ama yine de yumuşak bir nabız hareketi.
    var waves = [];
    for (var w = 0; w < 6; w++) {
        waves.push({
            freq: 0.3 + rand() * 2.5,   // her dalganın frekansı farklı
            phase: rand() * Math.PI * 2,  // rastgele faz
            amp: 0.05 + rand() * 0.12   // rastgele genlik
        });
    }

    // Zaman içinde frekans ve genlikler de yavaşça sürüklensin
    var drifts = [];
    for (var w = 0; w < waves.length; w++) {
        drifts.push({
            df: (rand() - 0.5) * 0.0003,  // frekans sürüklenme hızı
            da: (rand() - 0.5) * 0.0002   // genlik sürüklenme hızı
        });
    }

    var BASE_SIZE = 0.85;   // kalbin ortalama boyutu
    var time = 0;

    // Açılış: sıfırdan BASE_SIZE'a gel
    var opening = true;
    var openSize = 0.0;

    var loop = function () {
        time += 0.016;

        var size;

        if (opening) {
            openSize += 0.012;
            if (openSize >= BASE_SIZE) {
                openSize = BASE_SIZE;
                opening = false;
            }
            size = openSize;
        } else {
            // Dalgaları topla
            var offset = 0;
            for (var w = 0; w < waves.length; w++) {
                offset += waves[w].amp * Math.sin(waves[w].freq * time + waves[w].phase);

                // Sürükle
                waves[w].freq += drifts[w].df;
                waves[w].amp += drifts[w].da;

                // Sınırla
                if (waves[w].freq < 0.2) { waves[w].freq = 0.2; drifts[w].df *= -1; }
                if (waves[w].freq > 3.5) { waves[w].freq = 3.5; drifts[w].df *= -1; }
                if (waves[w].amp < 0.02) { waves[w].amp = 0.02; drifts[w].da *= -1; }
                if (waves[w].amp > 0.18) { waves[w].amp = 0.18; drifts[w].da *= -1; }

                // Sürüklenme hızını da zaman zaman küçük rastgele değiştir
                if (rand() < 0.002) drifts[w].df = (rand() - 0.5) * 0.0003;
                if (rand() < 0.002) drifts[w].da = (rand() - 0.5) * 0.0002;
            }

            size = BASE_SIZE + offset;
            // Toplam boyutu güvenli aralıkta tut
            size = Math.max(0.55, Math.min(1.05, size));
        }

        pulse(size);

        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.fillRect(0, 0, width, height);

        for (var i = e.length; i--;) {
            var u = e[i];
            var q = targetPoints[u.q];
            var dx = u.trace[0].x - q[0];
            var dy = u.trace[0].y - q[1];
            var len = Math.sqrt(dx * dx + dy * dy);

            if (10 > len) {
                if (0.95 < rand()) {
                    u.q = ~~(rand() * heartPointsCount);
                } else {
                    if (0.99 < rand()) { u.D *= -1; }
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) { u.q += heartPointsCount; }
                }
            }

            u.vx += -dx / len * u.speed;
            u.vy += -dy / len * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;

            for (var k = 0; k < u.trace.length - 1;) {
                var T = u.trace[k];
                var N = u.trace[++k];
                N.x -= 0.4 * (N.x - T.x);
                N.y -= 0.4 * (N.y - T.y);
            }

            ctx.fillStyle = u.f;
            for (var k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }

        window.requestAnimationFrame(loop, canvas);
    };

    loop();
};

var s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);
