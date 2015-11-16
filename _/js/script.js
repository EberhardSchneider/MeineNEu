function Termine(a, b, c, d, e, f) {
    this.name = a, this.location = b, this.description = c, this.link = d, this.datum = e, 
    this.id = f;
}

function getMonthAsDiv(a, b, c) {
    var d = !1;
    if (-1 == [ "monat", "woche" ].indexOf(c)) return !1;
    var e = document.createElement("div");
    e.className = "calendar", "monat" == c ? e.className = "calLine" : e.className = "calBox";
    var f = 31;
    4 == a || 6 == a || 9 == a || 11 == a ? f-- : 2 == a && (f = 28, b % 4 === 0 && f++, 
    b % 100 === 0 && f--, b % 400 === 0 && f++), monthHeader = document.createElement("div"), 
    monthHeader.className = "month-header", leftArrow = document.createElement("div"), 
    leftArrow.className = "calendar-left-arrow", rightArrow = document.createElement("div"), 
    rightArrow.className = "calendar-right-arrow", imgLeftArrow = document.createElement("img"), 
    imgRightArrow = document.createElement("img"), imgLeftArrow.src = "icons/left.svg", 
    imgRightArrow.src = "icons/right.svg", leftArrow.appendChild(imgLeftArrow), rightArrow.appendChild(imgRightArrow);
    var g = document.createElement("div");
    if (g.className = "month-name", g.innerHTML = monthsNames[a - 1] + " " + b, monthHeader.appendChild(leftArrow), 
    monthHeader.appendChild(g), monthHeader.appendChild(rightArrow), e.appendChild(monthHeader), 
    "monat" == c) for (var h = 1; f >= h; h++) {
        var i = document.createElement("div");
        i.className = "day", i.innerHTML = "" + h;
        var j = new Date(b, a - 1, h), k = j.toString().slice(0, 3);
        ("Sat" == k || "Sun" == k) && (i.className += " weekend");
        for (var l = 0; l < calendar.length; l++) calendar[l].datum.getYear() == j.getYear() && calendar[l].datum.getMonth() == j.getMonth() && calendar[l].datum.getDate() == j.getDate() && (i.id += "termin_" + calendar[l].id, 
        i.className += " termin", console.log("Termin gefunden"));
        e.appendChild(i);
    } else for (var m = 1; f >= m; ) {
        var n = new Date();
        d = m == n.getDate() && a - 1 == n.getMonth() && b - 1900 == n.getYear() ? !0 : !1;
        var j = new Date(b, a - 1, m), k = j.toString().slice(0, 3);
        if (1 == m) {
            var o = document.createElement("ul");
            o.className = "week";
            for (var h = 1; h <= [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ].indexOf(k); h++) {
                var i = document.createElement("li");
                i.innerHTML = " ", i.className = "day", d && (i.className += " today"), o.appendChild(i);
            }
        } else if ("Mon" == k) {
            var o = document.createElement("ul");
            o.className = "week";
        }
        var i = document.createElement("li");
        i.className = "day", i.innerHTML = "" + m, ("Sat" == k || "Sun" == k) && (i.className += " weekend");
        for (var l = 0; l < calendar.length; l++) calendar[l].datum.getYear() == j.getYear() && calendar[l].datum.getMonth() == j.getMonth() && calendar[l].datum.getDate() == j.getDate() && (i.id += "termin_" + calendar[l].id, 
        i.className += " termin");
        d && (i.className += " today"), o.appendChild(i), ("Sun" == k || m == f) && e.appendChild(o), 
        m++;
    }
    return e;
}

function zeigeTermin(a) {
    $(".page-wrapper").css("overflow", "hidden"), $(".termin-box").stop().css("bottom", "-700px").animate({
        bottom: "0"
    }, 500, function() {
        $(".page-wrapper").css("overflow-y", "auto").css("overflow-x", "hidden");
    }), id = a.slice(7, a.length);
    for (var b = 0; b < calendar.length; b++) if (calendar[b].id == id) {
        var c = document.createElement("div");
        c.className = "termin-info", c.innerHTML = "<h1>" + calendar[b].datum.toLocaleDateString() + " ";
        for (var d = calendar[b].datum.getHours() + "h" + calendar[b].datum.getMinutes(); d.length < 5; ) d += "0";
        c.innerHTML = "<h1>" + calendar[b].datum.toLocaleDateString() + " " + d, c.innerHTML += "<br><h2>" + calendar[b].name + "</h2><br>", 
        c.innerHTML += calendar[b].description + "<br>", c.innerHTML += calendar[b].location + "<br>", 
        $(".termin-box").children().remove(), $(".termin-box").append(c).removeClass("hide");
    }
}

function wireNavigation() {
    $(".navbar-home").click(function() {
        $(".active").removeClass("active"), $(this).parent().addClass("active"), changeMenuTo(0);
    }), $(".navbar-termine").click(function() {
        $(".active").removeClass("active"), $(this).parent().addClass("active"), c.setReadyFunction(function() {
            timeline.activate;
        }), changeMenuTo(1), timeline.activate();
    }), $(".navbar-media").click(function() {
        $(".active").removeClass("active"), $(this).parent().addClass("active"), changeMenuTo(2);
    }), $(".navbar-kontakt").click(function() {
        $(".active").removeClass("active"), $(this).parent().addClass("active"), changeMenuTo(3);
    });
}

function changeMenuTo(a) {
    $(".effect-overlay").stop().fadeIn(0).delay(100).fadeOut(1e3), c.updateHTML(a);
}

function projekteAusgeben() {
    $.ajax({
        url: "include/projekte.php",
        type: "GET",
        dataType: "json",
        async: !1,
        success: function(a) {
            a.forEach(function() {
                console.log(a.name), console.log("h"), console.log();
            });
        }
    }).done(function() {
        console.log("success");
    }).fail(function() {
        console.log("error");
    }).always(function() {
        console.log("complete");
    });
}

function hello() {
    console.log("hello ");
}

var Agenda = {
    container: {
        css: {
            position: "absolute",
            left: "0",
            top: "80px",
            width: "1000%",
            height: "220px",
            overflow: "hidden"
        },
        timeLine: []
    },
    markUp: "",
    deceleration: .9,
    isMouseDown: !1,
    draggedObject: {
        domElement: {},
        x: 0,
        y: 0
    },
    leftPos: 0,
    oldLeftPos: 0,
    scrollSpeed: 0,
    lastT: 0,
    deltaT: 0,
    scrolling: !1,
    scrollHandler: function() {},
    init: function() {
        var a = Agenda, b = document.createElement("div");
        b.className = "agenda invisible", $.ajax({
            dataType: "json",
            url: "include/events.json",
            success: function(b) {
                var c = "";
                $.each(b, function(a, b) {
                    var d = "";
                    $.each(b.besetzung, function(a, b) {
                        d += "<div class='zeile'><span class='rolle'>" + a + ":</span><span class='darsteller'>" + b + "</span></div>";
                    });
                    var e = new Date(b.datum), f = e.toLocaleDateString(), g = e.toLocaleTimeString(navigator.language, {
                        hour: "2-digit",
                        minute: "2-digit"
                    });
                    g = g.replace(":", "h"), c += '<div class="event">\n							<div class="komponist">' + b.komponist + '</div>\n							<div class="title">' + b.title + '</div>\n							<div class="ort">' + b.ort + '</div>\n							<div class="datum">' + f + " " + g + '</div>\n							<div class="besetzung">' + d + "</div>\n						</div>";
                }), a.html = c;
            }
        });
    },
    activate: function() {
        var a = Agenda;
        $(".timeline").html(a.html), a.activateNavigation();
    },
    activateNavigation: function() {
        for (var a = document.getElementsByClassName("event"), b = 0; b < a.length; b++) $(".agenda")[0].addEventListener("mousedown", Agenda.mouseDownHandler, !1), 
        document.body.addEventListener("mouseup", Agenda.mouseUpHandler, !1), document.body.addEventListener("mousemove", Agenda.mouseMoveHandler, !1);
    },
    animateTimeline: function() {
        var a = Agenda;
        a.leftPos += a.scrollSpeed, $(".agenda").css("left", a.leftPos + "px");
    },
    mouseDownHandler: function(a) {
        var b = Agenda;
        if (!b.isMouseDown) {
            b.isMouseDown = !0, b.lastT = $.now(), $(".agenda").css("cursor", "move"), b.draggedObject.domElement = $(this), 
            b.draggedObject.x = a.pageX, b.draggedObject.y = a.pageY;
            var c = $(".agenda").css("left");
            c = c.substring(0, c.length - 2), b.oldLeftPos = parseInt(c), b.animateHandler = setInterval(b.animateTimeline, 20);
        }
    },
    mouseUpHandler: function(a) {
        var b = Agenda;
        b.scrollSpeed = 0, b.isMouseDown = !1, clearInterval(b.animateHandler), $(".agenda").css("cursor", "auto");
    },
    mouseMoveHandler: function(a) {
        if (Agenda.isMouseDown) {
            var b = Agenda.draggedObject.x - a.pageX;
            Agenda.deltaT = $.now() - Agenda.lastT, Agenda.lastT = $.now(), Agenda.scrollSpeed = -b / 10;
        }
    }
}, AudioPlayer = function() {
    function a() {
        track = {
            name: "",
            src: [],
            image: ""
        }, this.trackList = [], this.audioData = [], this.currentTrack = 0, this.playingPosition = 0, 
        this.isPlaying = !1, this.isAudioReady = !1, this.soundNode, "" === audioCtx ? this.isIE = !0 : this.isIE = !1;
    }
    return a.prototype.play = function() {
        this.isPlaying || (this.soundNode = audioCtx.createBufferSource(), this.soundNode.buffer = this.audioData[this.currentTrack], 
        this.soundNode.connect(audioCtx.destination), this.soundNode.start(), this.isPlaying = !0);
    }, a.prototype.stop = function() {
        this.isPlaying && (this.soundNode.stop(), this.isPlaying = !1);
    }, a.prototype.getAudio = function() {
        var a = this, b = 0;
        this.trackList.forEach(function(c, d) {
            function e(c) {
                audioCtx.decodeAudioData(f.response, function(c) {
                    a.audioData.push(c), b++, b == a.trackList.length && (a.isAudioReady = !0);
                }, function(a) {
                    console.log(a);
                });
            }
            var f = new XMLHttpRequest();
            f.open("GET", c.src, !0), f.responseType = "arraybuffer", f.addEventListener("load", e, !1), 
            f.send();
        });
    }, a.prototype.addTrack = function(a, b, c) {
        var d = !1;
        if (this.trackList.forEach(function(b) {
            b.name == a && (d = !0);
        }), d) return !1;
        var e = {};
        e.name = a, e.src = b, e.image = c, this.trackList.push(e);
    }, a.prototype.removeTrack = function(a) {
        var b = -1;
        this.trackList.forEach(function(c, d) {
            c.name == a && (b = d);
        }), b > -1 && this.trackList.splice(b, 1);
    }, a.prototype.refreshPlayer = function(a) {
        if (0 !== this.trackList.length && this.isAudioReady) {
            var b = this.trackList[this.currentTrack], c = document.createElement("img");
            c.src = b.image, $(".audio-track-image").empty().append(c), $(".audio-track-name").empty().append(b.name);
        }
    }, a.prototype.wireButtons = function() {
        var a = this;
        $(".audio-back-button").click(function() {
            a.stop(), a.currentTrack--, a.currentTrack < 0 && (a.currentTrack = a.trackList.length - 1), 
            a.refreshPlayer();
        }), $(".audio-forward-button").click(function() {
            a.stop(), a.currentTrack++, a.currentTrack == a.trackList.length && (a.currentTrack = 0), 
            a.refreshPlayer();
        }), $(".audio-play-button").click(function() {
            a.play();
        }), $(".audio-stop-button").click(function() {
            a.stop();
        });
    }, a.prototype.getPlayerHTML = function() {
        if ("" === audioCtx) return HLP.createHTML("p", "InternetExplorer support not implemented yet", "audio-wrapper");
        var a = HLP.createHTML("div", "", "audio-wrapper"), b = HLP.createHTML("div", "", "audio-title"), c = HLP.createHTML("div", "", "audio-track-image"), d = HLP.createHTML("div", "", "audio-track-name"), e = HLP.createHTML("div", "", "audio-progress"), f = HLP.createHTML("div", "", "audio-controls"), g = document.createElement("a"), h = document.createElement("a"), i = document.createElement("a"), j = document.createElement("a");
        return g.className = "audio-play-button fa-stack", g.innerHTML = "<span class='fa fa-circle fa-stack-2x icon-background'></span><span class='fa fa-play fa-inverse small'></span>", 
        h.className = "audio-stop-button fa-stack", h.innerHTML = "<span class='fa fa-circle fa-stack-2x icon-background'></span><span class='fa fa-stop fa-inverse small'></span>", 
        i.className = "audio-back-button fa-stack", i.innerHTML = "<span class='fa fa-circle fa-stack-2x icon-background'></span><span class='fa fa-step-backward fa-inverse small'></span>", 
        j.className = "audio-forward-button fa-stack", j.innerHTML = "<span class='fa fa-circle fa-stack-2x icon-background'></span><span class='fa fa-step-forward fa-inverse small'></span>", 
        f.appendChild(i), f.appendChild(g), f.appendChild(h), f.appendChild(j), b.appendChild(c), 
        b.appendChild(d), a.appendChild(b), a.appendChild(e), a.appendChild(f), a;
    }, a;
}(), Calendar = function() {
    function a() {
        this.currentYear = 2015, this.currentMonth = 8, this.events = [], this.targetClass = "", 
        this.daysNames = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ], this.monthsNames = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];
    }
    return a.prototype.nextMonth = function() {
        this.currentMonth = 12 == this.currentMonth ? 1 : this.currentMonth + 1, 1 == this.currentMonth && this.currentYear++, 
        this.renderMonth();
    }, a.prototype.lastMonth = function() {
        this.currentMonth = 1 == this.currentMonth ? 12 : this.currentMonth - 1, 12 == this.currentMonth && this.currentYear--, 
        this.renderMonth();
    }, a.prototype.setTargetClass = function(a) {
        this.targetClass = a;
    }, a.prototype.wireEvents = function() {
        var a = this;
        $(".termin").click(function() {
            a.showEvent($(this).attr("id"));
        });
    }, a.prototype.showEvent = function(a) {
        var b = this;
        a = a.slice(7, a.length);
        for (var c = 0; c < b.events.length; c++) if (b.events[c].id == a) {
            var d = document.createElement("div");
            d.className = "termin-info", d.innerHTML = "<h1>" + b.events[c].datum.toLocaleDateString() + " ";
            for (var e = b.events[c].datum.getHours() + "h" + b.events[c].datum.getMinutes(); e.length < 5; ) e += "0";
            d.innerHTML = "<h1>" + b.events[c].datum.toLocaleDateString() + " " + e, d.innerHTML += "<br><h2>" + b.events[c].name + "</h2><br>", 
            d.innerHTML += b.events[c].description + "<br>", d.innerHTML += b.events[c].location + "<br>", 
            $(".termin-box").children().remove(), $(".termin-box").append(d).removeClass("hide");
        }
        $(".termin-info").finish().animate({
            backgroundColor: "rgba(255ert,255,255,1)"
        }, 700);
    }, a.prototype.getData = function(a) {
        var b = this;
        $.ajax({
            url: a,
            type: "POST",
            data: {
                year: b.currentYear
            },
            dataType: "json",
            async: !1,
            success: function(a) {
                b.events = a;
                for (var c = 0; c < b.events.length; c++) b.events[c].datum = new Date(b.events[c].datum.replace(" ", "T"));
            }
        }).done(function() {
            console.log("success");
        }).fail(function() {
            console.log("error");
        }).always(function() {
            console.log("complete");
        });
    }, a.prototype.renderMonth = function() {
        var a = this, b = new Date(), c = HLP.createHTML("div", "", "calendar"), d = a.currentMonth, e = a.currentYear, f = 31;
        4 == d || 6 == d || 9 == d || 11 == d ? f-- : 2 == d && (f = 28, e % 4 === 0 && f++, 
        e % 100 === 0 && f--, e % 400 === 0 && f++);
        var g = HLP.createHTML("div", "", "month-header"), h = HLP.createHTML("div", "", "calendar-left-arrow"), i = HLP.createHTML("div", "", "calendar-right-arrow");
        imgLeftArrow = document.createElement("img"), imgRightArrow = document.createElement("img"), 
        imgLeftArrow.src = "icons/left.svg", imgRightArrow.src = "icons/right.svg", h.appendChild(imgLeftArrow), 
        i.appendChild(imgRightArrow), h.onclick = function() {
            a.lastMonth();
        }, i.onclick = function() {
            a.nextMonth();
        };
        var j = HLP.createDIV("month-name", a.monthsNames[d - 1] + " " + e);
        g.appendChild(h), g.appendChild(j), g.appendChild(i), c.appendChild(g);
        for (var k = 1, l = document.createElement("ul"); f >= k; ) {
            var m, n;
            m = k == b.getDate() && d - 1 == b.getMonth() && e - 1900 == b.getYear() ? !0 : !1;
            var o = new Date(e, d - 1, k), p = o.toString().slice(0, 3);
            n = document.createElement("li"), n.className = "day", n.innerHTML = "" + k, ("Sat" == p || "Sun" == p) && (n.className += " weekend");
            for (var q = 0; q < a.events.length; q++) a.events[q].datum.getYear() == o.getYear() && a.events[q].datum.getMonth() == o.getMonth() && a.events[q].datum.getDate() == o.getDate() && (n.id += "termin_" + a.events[q].id, 
            n.className += " termin", n.onclick = function() {
                a.showEvent(this.id);
            });
            m && (n.className += " today"), l.appendChild(n), k++;
        }
        l.className = "monatListe", c.appendChild(l), $(".calendar-applet").empty().append(c);
    }, a;
}(), Caroussel = function() {
    function b(a, b, c, d) {
        this.content = [], this.HTMLPages = [], this.activeContentId = 0, this.numberOfContentBoxes = 0, 
        this.rotationDelay = 400, this.rotationDuration = 500, this.isRotating = !1, this.rotationUnbound = !1, 
        this.XMLFileName = a, this.leftItem = c.get(), this.rightItem = d.get(), this.menuItems = "", 
        this.activeMenuName = "", this.wireRotation($(this.leftItem), $(this.rightItem)), 
        this.HTMLReady = function() {}, this.initCallback = function() {};
    }
    return b.prototype.setInitCallback = function(a) {
        var b = this;
        "function" == typeof a && (b.initCallback = a);
    }, b.prototype.setReadyFunction = function(a) {
        this.HTMLReady = a;
    }, b.prototype.setMenuItems = function(a) {
        this.menuItems = a;
    }, b.prototype.getMenuItems = function() {
        return this.menuItems;
    }, b.prototype.getNameOfActiveMenu = function() {
        return this.activeMenuName;
    }, b.prototype.init = function() {
        var a = this;
        $.ajax({
            url: "include/content.xml",
            type: "GET",
            datatype: "xml",
            success: function(b) {
                a.parseXML($(b)), a.HTMLPages = a.content[0], a.initCallback();
            }
        });
    }, b.prototype.updateHTML = function(a) {
        var b = this;
        b.HTMLPages = b.content[a], b.numberOfContentBoxes = b.HTMLPages.length, 2 == b.numberOfContentBoxes && (b.HTMLPages[2] = this.HTMLPages[0]), 
        b.loadPages(), b.HTMLReady();
    }, b.prototype.unbindRotation = function() {
        var a = this;
        $(a.leftItem).off(), $(a.rightItem).off();
    }, b.prototype.getContentXML = function(a, b) {
        var c = this;
        c.HTMLPages = [], $.ajax({
            url: "include/content.xml",
            type: "GET",
            datatype: "xml",
            success: function(a) {
                c.HTMLPages = c.parseXML($(a), b), c.numberOfContentBoxes = c.HTMLPages.length, 
                2 == c.numberOfContentBoxes && (c.HTMLPages[2] = this.HTMLPages[0]), c.loadPages(), 
                c.HTMLReady();
            }
        });
    }, b.prototype.wireRotation = function() {
        var a = this;
        1 == a.numberOfContentBoxes && "termine" != a.getNameOfActiveMenu() ? ($(".arrow-right").addClass("hide"), 
        $(".arrow-left").addClass("hide")) : ($(".arrow-right").removeClass("hide"), $(".arrow-left").removeClass("hide"), 
        $(a.leftItem).on("click", function() {
            a.leftRotation();
        }), $(a.rightItem).on("click", function() {
            a.rightRotation();
        }));
    }, b.prototype.adjustLeftRotation = function() {
        var a = this;
        a.activeContentId--, a.activeContentId < 0 && (a.activeContentId = a.numberOfContentBoxes - 1), 
        $(".content-middle").empty().append(a.HTMLPages[a.activeContentId]), $(".content-rotate").css("left", "-100%");
        var b = a.activeContentId == a.numberOfContentBoxes - 1 ? 0 : a.activeContentId + 1, c = 0 === a.activeContentId ? a.numberOfContentBoxes - 1 : a.activeContentId - 1;
        $(".content-left").empty().append(a.HTMLPages[c]), $(".content-right").empty().append(a.HTMLPages[b]);
    }, b.prototype.adjustRightRotation = function() {
        var a = this;
        a.activeContentId++, a.activeContentId > a.numberOfContentBoxes - 1 && (a.activeContentId = 0), 
        $(".content-middle").empty().append(a.HTMLPages[a.activeContentId]), $(".content-rotate").css("left", "-100%");
        var b = a.activeContentId == a.numberOfContentBoxes - 1 ? 0 : a.activeContentId + 1, c = 0 === a.activeContentId ? a.numberOfContentBoxes - 1 : a.activeContentId - 1;
        $(".content-left").empty().append(a.HTMLPages[c]), $(".content-right").empty().append(a.HTMLPages[b]);
    }, b.prototype.leftRotation = function() {
        var a = this;
        a.isRotating || ($(a.leftItem).fadeOut(0).fadeIn(250), a.isRotating = !0, $(".content-rotate").delay(a.rotationDelay).animate({
            left: "0"
        }, a.rotationDuration, "swing", function() {
            a.isRotating = !1, a.adjustLeftRotation();
        }));
    }, b.prototype.rightRotation = function() {
        var a = this;
        a.isRotating || ($(a.rightItem).fadeOut(0).fadeIn(250), a.isRotating = !0, $(".content-rotate").delay(a.rotationDelay).animate({
            left: "-200%"
        }, a.rotationDuration, "swing", function() {
            a.isRotating = !1, a.adjustRightRotation();
        }));
    }, b.prototype.loadPages = function() {
        var a = this;
        if (1 == a.HTMLPages.length) return $(".content-middle").empty().append(a.HTMLPages[0]), 
        void a.wireRotation($(this.leftItem), $(this.rightItem));
        $(".content-middle").empty().append(a.HTMLPages[a.activeContentId]);
        var b = a.activeContentId == a.numberOfContentBoxes - 1 ? 0 : a.activeContentId + 1, c = 0 === a.activeContentId ? a.numberOfContentBoxes - 1 : a.activeContentId - 1;
        $(".content-left").empty().append(a.HTMLPages[c]), $(".content-right").empty().append(a.HTMLPages[b]), 
        a.wireRotation($(this.leftItem), $(this.rightItem));
    }, b.prototype.parseXML = function(b) {
        var c = this, d = [];
        b.find("content").children().each(function(b, c) {
            pages = [], $(c).children().each(function(b) {
                var c;
                HTMLPage = HLP.createHTML("div", "", "page-wrapper"), $(this).children().each(function(b) {
                    switch ($obj = $(this), tag = $obj.prop("tagName"), text = $obj.text(), tag) {
                      case "div":
                        c = HLP.createHTML("div", text);
                        break;

                      case "p":
                        c = HLP.createHTML("p", text);
                        break;

                      case "title":
                        c = HLP.createHTML("h1", text);
                        break;

                      case "image":
                        c = document.createElement("img"), c.src = $obj.attr("src");
                        break;

                      case "calendar":
                        c = document.createElement("div"), c.className = "calendar-applet";
                        break;

                      case "timeline":
                        c = HLP.createHTML("div", "", "timeline");
                        break;

                      case "audioplayer":
                        c = a.getPlayerHTML();
                        break;

                      case "HTML":
                        c = HLP.createDIV("html", ""), c.innerHTML = text;
                    }
                    HTMLPage.appendChild(c);
                }), pages.push(HTMLPage);
            }), d.push(pages);
        }), c.content = d, console.log("content fertig");
    }, b;
}(), daysNames = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ], monthsNames = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ], showingTermin = !1, c, a, cal, timeline, audioCtx;

$(function() {
    function b() {
        timeline = new Timeline($(".arrow-left"), $("arrow-right"), "include/events.json", ".timeline"), 
        timeline.setInitCallback(d), timeline.init(), c = new Caroussel("include/content.xml", 0, $(".arrow-left"), $(".arrow-right")), 
        c.init(), c.setInitCallback(d), c.setMenuItems([ "home", "termine", "media", "kontakt" ]);
    }
    function d() {
        e++, console.log(e), 2 == e && (changeMenuTo(0), wireNavigation(), $(".effect-overlay").stop().fadeOut(1e3));
    }
    var e = 0;
    $(".effect-overlay").stop().fadeIn(0), b(), audioCtx = window.AudioContext || window.webkitAudioContext ? new (window.AudioContext || window.webkitAudioContext)() : "", 
    a = new AudioPlayer(), cal = new Calendar(), c.setReadyFunction(function() {
        a.refreshPlayer(), a.wireButtons(), "termine" == c.getNameOfActiveMenu() && (cal.renderMonth(), 
        Agenda.activate());
    }), a.addTrack("Sezuan Studie 1", [ "audio/sezuan1.mp3" ], "images/eins.jpg"), a.addTrack("Sezuan Studie 2", [ "audio/sezuan2.mp3" ], "images/zwei.jpg"), 
    a.getAudio();
});

var HLP = HLP || {};

HLP = {
    createHTML: function(a, b, c) {
        c = c || "", b = b || "";
        var d = document.createElement(a);
        return "" !== c && d.classList.add(c), "" !== b && (textNode = document.createTextNode(b), 
        d.appendChild(textNode)), d;
    },
    createDIV: function(a, b) {
        a = a || "", b = b || "";
        var c = document.createElement("div");
        return "" !== a && c.classList.add(a), "" !== b && (textNode = document.createTextNode(b), 
        c.appendChild(textNode)), c;
    }
};

var Timeline = function() {
    function a(a, b, c, d) {
        this.leftIcon = a, this.rightIcon = b, this.jsonFile = c, this.target = d, this.events = [], 
        this.html = "", this.currentEventIndex = -1, this.initCallback = function() {};
    }
    return a.prototype.setInitCallback = function(a) {
        var b = this;
        "function" == typeof a && (b.initCallback = a);
    }, a.prototype.init = function() {
        this.getEventsFromJson();
    }, a.prototype.activate = function() {
        var a = this;
        $(a.target).html(a.html), a.activateNavigation();
    }, a.prototype.deactivate = function() {
        var a = this;
        a.deactivateNavigation();
    }, a.prototype.getEventsFromJson = function() {
        var a = this;
        $.ajax({
            dataType: "json",
            url: this.jsonFile,
            success: function(b) {
                var c = "", d = [];
                $.each(b, function(a, b) {
                    b.dateInMilliseconds = Date.parse(b.datum), d.push(b);
                }), d.sort(function(a, b) {
                    return a.dateInMilliseconds - b.dateInMilliseconds;
                }), d.forEach(function(a, b) {
                    var d = "";
                    $.each(a.besetzung, function(a, b) {
                        d += "<div class='zeile'><span class='rolle'>" + a + ":</span><span class='darsteller'>" + b + "</span></div>";
                    });
                    var e = new Date(a.datum), f = e.toLocaleDateString(), g = e.toLocaleTimeString(navigator.language, {
                        hour: "2-digit",
                        minute: "2-digit"
                    });
                    g = g.replace(":", "h"), c += '<div class="event">\r\n							<div class="komponist">' + a.komponist + '</div>\r\n							<div class="title">' + a.title + '</div>\r\n							<div class="ort">' + a.ort + '</div>\r\n							<div class="datum">' + f + " " + g + '</div>\r\n							<div class="besetzung">' + d + "</div>\r\n						</div>";
                }), a.html = c, a.events = d, a.initCallback();
            }
        });
    }, a.prototype.activateNavigation = function() {
        function a() {
            var a = Date.now(), b = -1;
            c.events.forEach(function(c, d) {
                c.dateInMilliseconds > a && -1 == b && (b = d);
            }), -1 == b && console.log(" Keine kommenden Vorstellungen! ");
            var d = $(c.target).children().eq(b), e = d[0].offsetLeft;
            $(c.target).css("left", -e), d.addClass("highlight"), console.log(c.events);
        }
        function b() {}
        var c = this;
        a(), b();
    }, a.prototype.deactivateNavigation = function() {}, a;
}();