(function () {
    this.jdVideo = function () {
        this.videoWidth = 0;
        this.videoHeight = 0;
        this.stickyClosed = false;
        this.sticked = false;
        this.readyForSticky = false;

        // Option defaults
        var defaults = {
            prefix: 'jd',
            type: '',
            src: '',
            thumbnail: '',
            size: '16by9',
            overlay: '',
            icon: '<span>&#8227;</span>',
            autoplay: false,
            loop: false,
            muted: false,
            controls: true,
            sticky: false,
            stickyPosition: 'bottom-right',
            vimeo: {},
            youtube: {}
        };

        // Element Reference
        if (arguments[0] && typeof arguments[0] === "object") {
            this.element = arguments[0];
        } else {
            throw "Call jdb video on an HTML element.";
        }

        // Options by extending defaults
        if (arguments[1] && typeof arguments[1] === "object") {
            this.options = extendDefaults(defaults, arguments[1]);
        }

        build.call(this);
    };

    function build() {
        var _this = this;
        this.element.innerHTML = '';

        var wrapper, thumbnailWrapper, playerWrapper, loading, icon;
        addClass(this.element, this.options.prefix + '-video');

        // wrapper
        wrapper = document.createElement('div');
        addClass(wrapper, this.options.prefix + '-video-wrapper');
        addClass(wrapper, this.options.prefix + '-video-' + _this.options.type);
        addClass(wrapper, this.options.prefix + '-video-size-' + _this.options.size);
        this.wrapper = wrapper;

        // loading
        loading = document.createElement('div');
        addClass(loading, this.options.prefix + '-video-loading');
        loading.innerHTML = '<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve"><path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur=".5s" from="0 50 50" to="360 50 50" repeatCount="indefinite" /></path></svg>';
        this.loading = loading;
        wrapper.appendChild(loading);

        // thumbnail wrapper
        thumbnailWrapper = document.createElement('div');
        addClass(thumbnailWrapper, this.options.prefix + '-video-play');
        if (this.options.overlay != '') {
            var overlay = document.createElement('span');
            addClass(overlay, this.options.prefix + '-video-overlay');
            overlay.style.background = this.options.overlay;
            thumbnailWrapper.appendChild(overlay);
        }
        thumbnailWrapper.addEventListener('click', function () {
            loadPlayer.call(_this, true);
        });
        this.thumbnailWrapper = thumbnailWrapper;

        // thumbnail
        getVideoThumbnail.call(this);

        // icon
        icon = document.createElement('div');
        addClass(icon, this.options.prefix + '-video-playicon');

        if (this.options.icon != '') {
            icon.innerHTML = this.options.icon;
        }

        thumbnailWrapper.appendChild(icon);


        wrapper.appendChild(thumbnailWrapper);
        this.element.appendChild(wrapper);

        if (_this.options.sticky) {
            var placeholder = document.createElement('div');
            addClass(placeholder, this.options.prefix + '-video-placeholder');
            addClass(placeholder, this.options.prefix + '-video-size-' + this.options.size);
            placeholder.innerHTML = 'Playing in sticky view.';
            this.element.appendChild(placeholder);
        }

        // if autoplay is enabled
        if (this.options.autoplay) {
            loadPlayer.call(_this, true);
        }

        this.videoHeight = this.wrapper.offsetHeight;
        this.videoWidth = this.wrapper.offsetWidth;

        if (this.options.sticky) {
            var stickyClose = document.createElement('div');
            window.addEventListener('scroll', function () {
                if (_this.stickyClosed || _this.sticked) {
                    return;
                }
                if (!isInView(_this.element) && _this.readyForSticky) {
                    _this.sticked = true;
                    addClass(_this.element, _this.options.prefix + '-video-sticky');
                    addClass(_this.element, _this.options.prefix + '-video-sticky-' + _this.options.stickyPosition);
                    if (_this.options.stickyPosition == 'bottom-left' || _this.options.stickyPosition == 'bottom-right') {
                        stickyClose.style.marginBottom = (_this.wrapper.offsetHeight - 20) + 'px';
                    }
                } else if (isInView(_this.element)) {
                    _this.readyForSticky = true;
                }
            });
            addClass(stickyClose, _this.options.prefix + '-video-sticky-close');
            stickyClose.innerHTML = '<span>&#10005;</span>';
            wrapper.appendChild(stickyClose);
            stickyClose.addEventListener('click', function () {
                _this.stickyClosed = true;
                removeClass(_this.element, _this.options.prefix + '-video-sticky');
                removeClass(_this.element, _this.options.prefix + '-video-sticky-' + _this.options.stickyPosition);
                stickyClose.style.marginBottom = 'auto';
            });
        }
    }

    function loadPlayer(_play) {
        this.loading.style.display = 'block';
        if (this.options.type == 'html5') {
            __loadVideo.call(this, _play);
        } else if (this.options.type == 'vimeo') {
            __loadVimeo.call(this, _play);
        } else if (this.options.type == 'youtube') {
            __loadYoutube.call(this, _play);
        }
    }

    function __loadVideo(_play) {
        var _this = this;

        playerWrapper = document.createElement('div');
        addClass(playerWrapper, _this.options.prefix + '-video-player');
        playerWrapper.style.display = "none";
        _this.wrapper.appendChild(playerWrapper);

        var $video = document.createElement('video');
        $video.canPlayType('video/mp4');
        $video.setAttribute('src', _this.options.src);
        $video.setAttribute('width', '100%');
        $video.setAttribute('height', '100%');
        $video.setAttribute('allow', 'autoplay');


        $video.loop = _this.options.loop;
        $video.muted = _this.options.muted;
        $video.controls = _this.options.controls;
        if (_play) {
            $video.autoplay = true;
            if (_this.options.autoplay) {
                $video.muted = true;
            }
        }

        playerWrapper.appendChild($video);

        $video.addEventListener('loadeddata', function () {
            playerWrapper.style.display = 'block'
            _this.thumbnailWrapper.remove();
            if (!_play) {
                _this.loading.style.display = 'none';
            } else {
                $video.play();
            }
            if (!_this.options.controls) {
                _this.wrapper.addEventListener('click', function () {
                    if ($video.paused) {
                        $video.play();
                    } else {
                        $video.pause();
                    }
                });
            }
        });

        $video.addEventListener('play', function () {
            _this.loading.style.display = 'none';
        });
    }

    function __loadVimeo(_play) {
        var _this = this;

        if (!(typeof window.Vimeo == 'object' && typeof window.Vimeo.Player == 'function')) {
            var tag = document.createElement('script');
            tag.id = this.options.prefix + '-vimeo-api';
            tag.src = 'https://player.vimeo.com/api/player.js';
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            document.getElementById(tag.id).addEventListener('load', function () {
                __loadVimeo.call(_this, _play);
            });
            return;
        }

        playerWrapper = document.createElement('div');
        addClass(playerWrapper, _this.options.prefix + '-video-player');
        playerWrapper.style.display = "none";
        _this.wrapper.appendChild(playerWrapper);

        var options = {};
        options.id = getVimeoId(_this.options.src);
        options.loop = _this.options.loop;
        options.muted = _this.options.muted;
        options.controls = _this.options.controls;
        options.title = false;
        options.portrait = false;
        options.byline = false;

        options = extendDefaults(options, _this.options.vimeo);
        var $vimeo = new Vimeo.Player(playerWrapper, options);

        $vimeo.on('loaded', function () {
            playerWrapper.style.display = 'block'
            _this.thumbnailWrapper.remove();
            if (_play) {
                $vimeo.play();
            } else {
                _this.loading.style.display = 'none';
            }
            if (!_this.options.controls) {
                _this.wrapper.addEventListener('click', function () {
                    if ($vimeo.getPaused()) {
                        $vimeo.play();
                    } else {
                        $vimeo.pause();
                    }
                });
            }
        });

        $vimeo.on('play', function () {
            _this.loading.style.display = 'none';
        });
    }

    function __loadYoutube(_play) {

        var _this = this;

        if (!(typeof window.YT == 'object' && typeof window.YT.Player == 'function')) {
            window.onYouTubeIframeAPIReady = function () {
                __loadYoutube.call(_this, _play);
            };

            var tag = document.createElement('script');
            tag.id = _this.options.prefix + '-youtube-api';
            tag.src = 'https://www.youtube.com/iframe_api';
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            return;
        }

        playerWrapper = document.createElement('div');
        addClass(playerWrapper, _this.options.prefix + '-video-player');
        playerWrapper.style.display = "none";
        _this.wrapper.appendChild(playerWrapper);

        var $video = document.createElement('div');
        var options = {};

        options.videoId = getYoutubeId(_this.options.src);
        options.playerVars = {
            loop: _this.options.loop ? 1 : 0,
            mute: _this.options.muted ? 1 : 0,
            controls: _this.options.controls ? 1 : 0,
            enablejsapi: 1,
            rel: 0
        };
        if (window.location.hostname != '') {
            options.playerVars.origin = window.location.hostname;
        }
        options.events = {
            onReady: function (event) {
                playerWrapper.style.display = 'block'
                _this.thumbnailWrapper.remove();

                if (_play) {
                    event.target.playVideo();
                } else {
                    _this.loading.style.display = 'none';
                }
            },
            onStateChange: function (event) {
                if (event.data === 1) {
                    _this.loading.style.display = 'none';
                }
            }
        }

        options.playerVars = extendDefaults(options.playerVars, _this.options.youtube);

        playerWrapper.appendChild($video);

        var $youtube = new window.YT.Player($video, options);
    }

    function getVimeoId(url) {
        if (url == '') {
            return null;
        }

        if (!Number.isNaN(Number(url))) {
            return url;
        }

        var regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
        return url.match(regex) ? RegExp.$2 : url;
    }

    function getYoutubeId(url) {
        if (url == '') {
            return null;
        }

        var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        return url.match(regex) ? RegExp.$2 : url;
    }

    function isInView(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Method to extend defaults
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    function hasClass(el, className) {
        if (el.classList)
            return el.classList.contains(className)
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }

    function addClass(el, className) {
        if (el.classList)
            el.classList.add(className)
        else if (!hasClass(el, className)) el.className += " " + className
    }

    function removeClass(el, className) {
        if (el.classList) el.classList.remove(className);
        else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
    }

    function getJSON(src, options) {
        var options = options || {},
            callback_name = options.callbackName || 'callback',
            on_success = options.onSuccess || function () {},
            on_timeout = options.onTimeout || function () {},
            timeout = options.timeout || 10;

        var timeout_trigger = window.setTimeout(function () {
            window[callback_name] = function () {};
            on_timeout();
        }, timeout * 1000);

        window[callback_name] = function (data) {
            window.clearTimeout(timeout_trigger);
            on_success(data);
        };

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = src;

        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function getVideoThumbnail() {
        var _this = this;

        if (this.options.thumbnail === '' && this.options.type == 'html5') {
            var $video = document.createElement('video');
            $video.controls = false;
            $video.src = this.options.src;
            $video.preload = 'metadata';
            this.thumbnailWrapper.appendChild($video);
        } else {
            var $thumbnail = this.options.thumbnail;
            if ($thumbnail === '') {
                if (this.options.type === 'vimeo') {
                    var _id = getVimeoId(this.options.src);
                    var promise = new Promise(function (resolve, reject) {
                        getJSON('https://www.vimeo.com/api/v2/video/' + _id + '.json?callback=' + _this.options.prefix + 'VimeoCallback', {
                            callbackName: _this.options.prefix + 'VimeoCallback',
                            onSuccess: function (json) {
                                resolve(json[0].thumbnail_large);
                            },
                            timeout: 2,
                            onTimeout: function () {
                                __loadVimeo.call(_this, false);
                            }
                        });
                    });

                    promise.then(function (url) {
                        __applyThumbnail.call(_this, url);
                    });
                }
                if (this.options.type === 'youtube') {
                    if ($thumbnail === false) {
                        __applyThumbnail.call(this, $thumbnail);
                        return;
                    }
                    var _id = getYoutubeId(this.options.src);
                    __applyThumbnail.call(this, 'https://i.ytimg.com/vi/' + _id + '/hqdefault.jpg');
                }
            } else {
                __applyThumbnail.call(this, $thumbnail);
            }
        }
    }

    function __applyThumbnail($thumbnail) {
        if ($thumbnail === false) {
            loadPlayer.call(this, this.options.autoplay);
            return;
        }
        var thumbnail = document.createElement('div');
        var thumbnailImg = document.createElement('img');
        thumbnailImg.src = $thumbnail;
        thumbnailImg.style.opacity = 0;
        thumbnailImg.style.transition = 'linear .2s opacity';
        addClass(thumbnail, this.options.prefix + '-video-thumbnail');
        thumbnailImg.addEventListener('load', function () {
            thumbnailImg.style.opacity = 1;
        });
        thumbnail.appendChild(thumbnailImg);
        this.thumbnailWrapper.appendChild(thumbnail);
    }
}());