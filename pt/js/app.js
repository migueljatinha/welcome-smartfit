(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/app.js":[function(require,module,exports){
    (function() {
    
        var isSmall = window.innerWidth < 768;
    
        var isLoaded = false;
        var loader = document.querySelector('.loader');
        var progressBar = loader.querySelector('.progress');
    
        var presentation = document.querySelector('.presentation');
    
        var imagePath = 'img/';
        var videoPath = 'video/';
    
        var keysPrev = [37, 38];
        var keysNext = [39, 40];
        var canStart = false;
    
        var index = 0;
        var total = 0;
        
        var touchStart = 0;
        var touchStartY = 0;
        var touchDistance = 100;
        var touchDistanceY = 100;
        var touchActived = false;
    
        var ico = document.querySelector('.ico');
    
        var slidesData = null;
    
        var setSlides = function(data) {
            slidesData = data.slides;
            total = slidesData.length;
            
            loadImages(data);
            slidesData.map(function(slide, i){
                var htmlSlide = document.createElement('div');
                if(slide.type === 'image'){
                    var img = (isSmall) ? slide.img_small : slide.img;
                    var bg = (isSmall) ? slide.bg_small : slide.bg;
                    htmlSlide.style.backgroundImage = 'url(' + imagePath + bg + ')';
                    htmlSlide.className = 'slide slide-img';
                    htmlSlide.id = 'slide-' + i;
                    htmlSlide.innerHTML = '<img src="'+ imagePath + img +'" />';
                }else if(slide.type === 'video'){
                    htmlSlide.style.background = '#000';
                    htmlSlide.className = 'slide slide-video';
                    htmlSlide.id = 'slide-' + i;
                    var htmlSlideVideo = document.createElement('video');
                    htmlSlideVideo.controls = isSmall;
                    htmlSlideVideo.loop = false;
                    htmlSlideVideo.className = (slide.style) ? slide.style : '';
                    htmlSlideVideo.src = videoPath + slide.video;
                    htmlSlide.appendChild(htmlSlideVideo);
                }else if(slide.type === 'yt'){
                    htmlSlide.id = 'slide-' + i;
                    htmlSlide.className = 'slide slide-yt';
                    var htmlSlideYt = document.createElement('div');
                    htmlSlideYt.id = 'slide-' + i + '-yt';
                    htmlSlide.appendChild(htmlSlideYt);
                }
                presentation.appendChild(htmlSlide);
    
                if(slide.type === 'yt'){
                    var controls = (isSmall) ? '1' : '0';
                    slide['player'] = new YT.Player('slide-' + i + '-yt', {
                        height: '390',
                        width: '640',
                        videoId: slide.id,
                        playerVars: {
                            showinfo: 0,
                            playsinline: 1,
                            controls: (isSmall) ? '1' : '0',
                            rel: 0,
                            loop: 1,
                            modestbranding: 1
                        }
                    });
                }
            });
            // to show the first
            showSlide(0);
        };
    
        var handleProgress = function(event){
            if(event.loaded === 1)
            {
                loader.classList.add('complete');
                progressBar.style.width = '100%';
                isLoaded = true;
                addListeners();
            }
            else
            {
                progressBar.style.width = event.loaded * 100 + '%';
            }
        };
    
        var loadImages = function(data) {
            
            var preload = new createjs.LoadQueue(true);
            preload.on('progress', handleProgress, this);
            
            slidesData.map(function(slide){
                if(slide.type === 'image'){
                    var img = (isSmall) ? slide.img_small : slide.img;
                    var bg = (isSmall) ? slide.bg_small : slide.bg;
                    preload.loadFile('img/'+img);
                    preload.loadFile('img/'+bg);
                }
            });
    
            preload.load();
            
        };
    
        var onKeyUp = function(event){
    
            if (!canStart)
            {
                $( ".playSlide" ).animate({
                    opacity: 0,
                    top: "10",
                    height: "toggle"
                  }, 300, function() {
                    canStart = true;
                    $(this).remove();
                  });
                return;
            } 
    
            key = event.keyCode;
            if( keysPrev.indexOf(key) != -1){
                goTo(index - 1);
            }
            else if(keysNext.indexOf(key) != -1){
                goTo(index + 1);
            }
        };
    
        var addListeners = function() {
            document.addEventListener('keyup', onKeyUp);
            ico.addEventListener('click', function(){GoInFullscreen(presentation)});
            presentation.addEventListener("touchstart", handleTouchStart);
            presentation.addEventListener("touchmove", handleTouchMove);
        };
    
        var handleTouchStart = function(event){
            touchActived = false;
            touchStart = event.touches[0].pageX;
            touchStartY = event.touches[0].pageY;
        };
    
        var handleTouchMove = function(event){
            if( !touchActived && (touchStartY > (event.touches[0].pageY + touchDistanceY) || touchStart > (event.touches[0].pageX + touchDistance) ) )
            {
                touchActived = true;
                touchStart = event.touches[0].pageX + touchDistance;
                touchStartY = event.touches[0].pageY + touchDistanceY;
                goTo(index + 1);
            }
            else if( !touchActived && (touchStartY < (event.touches[0].pageY - touchDistanceY) || touchStart < (event.touches[0].pageX - touchDistance) ) )
            {
                touchActived = true;
                touchStart = event.touches[0].pageX - touchDistance;
                touchStartY = event.touches[0].pageY - touchDistanceY;
                goTo(index - 1);
            }
        };
    
        //  slides
    
        var hideSlide = function(target){
            var toHide = document.querySelector('#slide-'+target); 
            if(slidesData[target].type === 'video')
            {
                toHide.querySelector('video').pause();
            }else if(slidesData[target].type === 'yt'){
                slidesData[target]['player'].pauseVideo();
            }
            toHide.classList.remove('active');
        };
    
        var showSlide = function(target = 0){
            var toShow = document.querySelector('#slide-'+target); 
            if(slidesData[target].type === 'video')
            {
                toShow.querySelector('video').load();
                toShow.querySelector('video').play();
            }else if(slidesData[target].type === 'yt'){
                slidesData[target]['player'].playVideo();
            }
            toShow.classList.add('active');
        };
    
        var goTo = function(target){
            if( target != index && target >= 0 && target < total ){
                hideSlide(index);
                showSlide(target);
                index = target;
            }
        };
    
        var supportsFullScreen = function(){
            return !!(
                    typeof document.body.requestFullscreen === 'function' ||
                    typeof document.body.mozRequestFullScreen === 'function' ||
                    typeof document.body.webkitRequestFullscreen === 'function' ||
                    typeof document.body.msRequestFullscreen === 'function'
                    );
    
        };
    
        function GoInFullscreen(element) {
        if(element.requestFullscreen)
            element.requestFullscreen();
        else if(element.mozRequestFullScreen)
            element.mozRequestFullScreen();
        else if(element.webkitRequestFullscreen)
            element.webkitRequestFullscreen();
        else if(element.msRequestFullscreen)
            element.msRequestFullscreen();
        }
    
    
        $(function() {
    
            window.onYouTubeIframeAPIReady = function() {
                $.getJSON( "js/data.json", function( data ) {
                    console.log('ok');
                    setSlides(data);
                });
            }
    
            $('.playSlide').on('click', function() {
                $( ".playSlide" ).animate({
                    opacity: 0,
                    top: "10",
                    height: "toggle"
                  }, 300, function() {
                    canStart = true;
                    $(this).remove();
                    goTo(0);
                  });
            });
    
            if(supportsFullScreen() && window.innerWidth >= 1024){
                ico.classList.add('active');
            }
    
        });
    
    })();
    },{}]},{},["./src/js/app.js"]);
    //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgaXNTbWFsbCA9IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4O1xuXG4gICAgdmFyIGlzTG9hZGVkID0gZmFsc2U7XG4gICAgdmFyIGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKTtcbiAgICB2YXIgcHJvZ3Jlc3NCYXIgPSBsb2FkZXIucXVlcnlTZWxlY3RvcignLnByb2dyZXNzJyk7XG5cbiAgICB2YXIgcHJlc2VudGF0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZXNlbnRhdGlvbicpO1xuXG4gICAgdmFyIGltYWdlUGF0aCA9ICdpbWcvJztcbiAgICB2YXIgdmlkZW9QYXRoID0gJ3ZpZGVvLyc7XG5cbiAgICB2YXIga2V5c1ByZXYgPSBbMzcsIDM4XTtcbiAgICB2YXIga2V5c05leHQgPSBbMzksIDQwXTtcblxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHRvdGFsID0gMDtcbiAgICBcbiAgICB2YXIgdG91Y2hTdGFydCA9IDA7XG4gICAgdmFyIHRvdWNoU3RhcnRZID0gMDtcbiAgICB2YXIgdG91Y2hEaXN0YW5jZSA9IDEwMDtcbiAgICB2YXIgdG91Y2hEaXN0YW5jZVkgPSAxMDA7XG4gICAgdmFyIHRvdWNoQWN0aXZlZCA9IGZhbHNlO1xuXG4gICAgdmFyIGljbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pY28nKTtcblxuICAgIHZhciBzbGlkZXNEYXRhID0gbnVsbDtcblxuICAgIHZhciBzZXRTbGlkZXMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHNsaWRlc0RhdGEgPSBkYXRhLnNsaWRlcztcbiAgICAgICAgdG90YWwgPSBzbGlkZXNEYXRhLmxlbmd0aDtcblxuICAgICAgICBsb2FkSW1hZ2VzKGRhdGEpO1xuICAgICAgICBzbGlkZXNEYXRhLm1hcChmdW5jdGlvbihzbGlkZSwgaSl7XG4gICAgICAgICAgICB2YXIgaHRtbFNsaWRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBpZihzbGlkZS50eXBlID09PSAnaW1hZ2UnKXtcbiAgICAgICAgICAgICAgICB2YXIgaW1nID0gKGlzU21hbGwpID8gc2xpZGUuaW1nX3NtYWxsIDogc2xpZGUuaW1nO1xuICAgICAgICAgICAgICAgIHZhciBiZyA9IChpc1NtYWxsKSA/IHNsaWRlLmJnX3NtYWxsIDogc2xpZGUuYmc7XG4gICAgICAgICAgICAgICAgaHRtbFNsaWRlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJyArIGltYWdlUGF0aCArIGJnICsgJyknO1xuICAgICAgICAgICAgICAgIGh0bWxTbGlkZS5jbGFzc05hbWUgPSAnc2xpZGUgc2xpZGUtaW1nJztcbiAgICAgICAgICAgICAgICBodG1sU2xpZGUuaWQgPSAnc2xpZGUtJyArIGk7XG4gICAgICAgICAgICAgICAgaHRtbFNsaWRlLmlubmVySFRNTCA9ICc8aW1nIHNyYz1cIicrIGltYWdlUGF0aCArIGltZyArJ1wiIC8+JztcbiAgICAgICAgICAgIH1lbHNlIGlmKHNsaWRlLnR5cGUgPT09ICd2aWRlbycpe1xuICAgICAgICAgICAgICAgIGh0bWxTbGlkZS5zdHlsZS5iYWNrZ3JvdW5kID0gJyMwMDAnO1xuICAgICAgICAgICAgICAgIGh0bWxTbGlkZS5jbGFzc05hbWUgPSAnc2xpZGUgc2xpZGUtdmlkZW8nO1xuICAgICAgICAgICAgICAgIGh0bWxTbGlkZS5pZCA9ICdzbGlkZS0nICsgaTtcbiAgICAgICAgICAgICAgICB2YXIgaHRtbFNsaWRlVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgICAgICAgICAgICAgIGh0bWxTbGlkZVZpZGVvLmNvbnRyb2xzID0gaXNTbWFsbDtcbiAgICAgICAgICAgICAgICBodG1sU2xpZGVWaWRlby5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaHRtbFNsaWRlVmlkZW8uY2xhc3NOYW1lID0gKHNsaWRlLnN0eWxlKSA/IHNsaWRlLnN0eWxlIDogJyc7XG4gICAgICAgICAgICAgICAgaHRtbFNsaWRlVmlkZW8uc3JjID0gdmlkZW9QYXRoICsgc2xpZGUudmlkZW87XG4gICAgICAgICAgICAgICAgaHRtbFNsaWRlLmFwcGVuZENoaWxkKGh0bWxTbGlkZVZpZGVvKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHNsaWRlLnR5cGUgPT09ICd5dCcpe1xuICAgICAgICAgICAgICAgIGh0bWxTbGlkZS5pZCA9ICdzbGlkZS0nICsgaTtcbiAgICAgICAgICAgICAgICBodG1sU2xpZGUuY2xhc3NOYW1lID0gJ3NsaWRlIHNsaWRlLXl0JztcbiAgICAgICAgICAgICAgICB2YXIgaHRtbFNsaWRlWXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBodG1sU2xpZGVZdC5pZCA9ICdzbGlkZS0nICsgaSArICcteXQnO1xuICAgICAgICAgICAgICAgIGh0bWxTbGlkZS5hcHBlbmRDaGlsZChodG1sU2xpZGVZdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmVzZW50YXRpb24uYXBwZW5kQ2hpbGQoaHRtbFNsaWRlKTtcblxuICAgICAgICAgICAgaWYoc2xpZGUudHlwZSA9PT0gJ3l0Jyl7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRyb2xzID0gKGlzU21hbGwpID8gJzEnIDogJzAnO1xuICAgICAgICAgICAgICAgIHNsaWRlWydwbGF5ZXInXSA9IG5ldyBZVC5QbGF5ZXIoJ3NsaWRlLScgKyBpICsgJy15dCcsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzkwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICc2NDAnLFxuICAgICAgICAgICAgICAgICAgICB2aWRlb0lkOiBzbGlkZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyVmFyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd2luZm86IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5c2lubGluZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xzOiAoaXNTbWFsbCkgPyAnMScgOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWw6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb29wOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZXN0YnJhbmRpbmc6IDFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gdG8gc2hvdyB0aGUgZmlyc3RcbiAgICAgICAgc2hvd1NsaWRlKDApO1xuICAgIH07XG5cbiAgICB2YXIgaGFuZGxlUHJvZ3Jlc3MgPSBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50LmxvYWRlZCk7XG4gICAgICAgIGlmKGV2ZW50LmxvYWRlZCA9PT0gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgbG9hZGVyLmNsYXNzTGlzdC5hZGQoJ2NvbXBsZXRlJyk7XG4gICAgICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgICAgIGlzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGFkZExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBldmVudC5sb2FkZWQgKiAxMDAgKyAnJSc7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGxvYWRJbWFnZXMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciBwcmVsb2FkID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZSh0cnVlKTtcblxuICAgICAgICBwcmVsb2FkLm9uKCdwcm9ncmVzcycsIGhhbmRsZVByb2dyZXNzLCB0aGlzKTtcbiAgICAgICAgXG4gICAgICAgIHNsaWRlc0RhdGEubWFwKGZ1bmN0aW9uKHNsaWRlKXtcbiAgICAgICAgICAgIGlmKHNsaWRlLnR5cGUgPT09ICdpbWFnZScpe1xuICAgICAgICAgICAgICAgIHZhciBpbWcgPSAoaXNTbWFsbCkgPyBzbGlkZS5pbWdfc21hbGwgOiBzbGlkZS5pbWc7XG4gICAgICAgICAgICAgICAgdmFyIGJnID0gKGlzU21hbGwpID8gc2xpZGUuYmdfc21hbGwgOiBzbGlkZS5iZztcbiAgICAgICAgICAgICAgICBwcmVsb2FkLmxvYWRGaWxlKCdpbWcvJytpbWcpO1xuICAgICAgICAgICAgICAgIHByZWxvYWQubG9hZEZpbGUoJ2ltZy8nK2JnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJlbG9hZC5sb2FkKCk7XG4gICAgICAgIFxuICAgIH07XG5cbiAgICB2YXIgb25LZXlVcCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAga2V5ID0gZXZlbnQua2V5Q29kZTtcbiAgICAgICAgaWYoIGtleXNQcmV2LmluZGV4T2Yoa2V5KSAhPSAtMSl7XG4gICAgICAgICAgICBnb1RvKGluZGV4IC0gMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihrZXlzTmV4dC5pbmRleE9mKGtleSkgIT0gLTEpe1xuICAgICAgICAgICAgZ29UbyhpbmRleCArIDEpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBhZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwKTtcbiAgICAgICAgaWNvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtHb0luRnVsbHNjcmVlbihwcmVzZW50YXRpb24pfSk7XG4gICAgICAgIHByZXNlbnRhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVUb3VjaFN0YXJ0KTtcbiAgICAgICAgcHJlc2VudGF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGFuZGxlVG91Y2hNb3ZlKTtcbiAgICB9O1xuXG4gICAgdmFyIGhhbmRsZVRvdWNoU3RhcnQgPSBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHRvdWNoQWN0aXZlZCA9IGZhbHNlO1xuICAgICAgICB0b3VjaFN0YXJ0ID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgdG91Y2hTdGFydFkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH07XG5cbiAgICB2YXIgaGFuZGxlVG91Y2hNb3ZlID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBpZiggIXRvdWNoQWN0aXZlZCAmJiAodG91Y2hTdGFydFkgPiAoZXZlbnQudG91Y2hlc1swXS5wYWdlWSArIHRvdWNoRGlzdGFuY2VZKSB8fCB0b3VjaFN0YXJ0ID4gKGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaERpc3RhbmNlKSApIClcbiAgICAgICAge1xuICAgICAgICAgICAgdG91Y2hBY3RpdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRvdWNoU3RhcnQgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYICsgdG91Y2hEaXN0YW5jZTtcbiAgICAgICAgICAgIHRvdWNoU3RhcnRZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWSArIHRvdWNoRGlzdGFuY2VZO1xuICAgICAgICAgICAgZ29UbyhpbmRleCArIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoICF0b3VjaEFjdGl2ZWQgJiYgKHRvdWNoU3RhcnRZIDwgKGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB0b3VjaERpc3RhbmNlWSkgfHwgdG91Y2hTdGFydCA8IChldmVudC50b3VjaGVzWzBdLnBhZ2VYIC0gdG91Y2hEaXN0YW5jZSkgKSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRvdWNoQWN0aXZlZCA9IHRydWU7XG4gICAgICAgICAgICB0b3VjaFN0YXJ0ID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWCAtIHRvdWNoRGlzdGFuY2U7XG4gICAgICAgICAgICB0b3VjaFN0YXJ0WSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSB0b3VjaERpc3RhbmNlWTtcbiAgICAgICAgICAgIGdvVG8oaW5kZXggLSAxKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyAgc2xpZGVzXG5cbiAgICB2YXIgaGlkZVNsaWRlID0gZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgdmFyIHRvSGlkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZS0nK3RhcmdldCk7IFxuICAgICAgICBpZihzbGlkZXNEYXRhW3RhcmdldF0udHlwZSA9PT0gJ3ZpZGVvJylcbiAgICAgICAge1xuICAgICAgICAgICAgdG9IaWRlLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJykucGF1c2UoKTtcbiAgICAgICAgfWVsc2UgaWYoc2xpZGVzRGF0YVt0YXJnZXRdLnR5cGUgPT09ICd5dCcpe1xuICAgICAgICAgICAgc2xpZGVzRGF0YVt0YXJnZXRdWydwbGF5ZXInXS5wYXVzZVZpZGVvKCk7XG4gICAgICAgIH1cbiAgICAgICAgdG9IaWRlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH07XG5cbiAgICB2YXIgc2hvd1NsaWRlID0gZnVuY3Rpb24odGFyZ2V0ID0gMCl7XG4gICAgICAgIHZhciB0b1Nob3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGUtJyt0YXJnZXQpOyBcbiAgICAgICAgaWYoc2xpZGVzRGF0YVt0YXJnZXRdLnR5cGUgPT09ICd2aWRlbycpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRvU2hvdy5xdWVyeVNlbGVjdG9yKCd2aWRlbycpLmxvYWQoKTtcbiAgICAgICAgICAgIHRvU2hvdy5xdWVyeVNlbGVjdG9yKCd2aWRlbycpLnBsYXkoKTtcbiAgICAgICAgfWVsc2UgaWYoc2xpZGVzRGF0YVt0YXJnZXRdLnR5cGUgPT09ICd5dCcpe1xuICAgICAgICAgICAgc2xpZGVzRGF0YVt0YXJnZXRdWydwbGF5ZXInXS5wbGF5VmlkZW8oKTtcbiAgICAgICAgfVxuICAgICAgICB0b1Nob3cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBnb1RvID0gZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgaWYoIHRhcmdldCAhPSBpbmRleCAmJiB0YXJnZXQgPj0gMCAmJiB0YXJnZXQgPCB0b3RhbCApe1xuICAgICAgICAgICAgaGlkZVNsaWRlKGluZGV4KTtcbiAgICAgICAgICAgIHNob3dTbGlkZSh0YXJnZXQpO1xuICAgICAgICAgICAgaW5kZXggPSB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHN1cHBvcnRzRnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAhIShcbiAgICAgICAgICAgICAgICB0eXBlb2YgZG9jdW1lbnQuYm9keS5yZXF1ZXN0RnVsbHNjcmVlbiA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICAgICAgICAgIHR5cGVvZiBkb2N1bWVudC5ib2R5Lm1velJlcXVlc3RGdWxsU2NyZWVuID09PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgICAgICAgICAgdHlwZW9mIGRvY3VtZW50LmJvZHkud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4gPT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgICAgICAgICB0eXBlb2YgZG9jdW1lbnQuYm9keS5tc1JlcXVlc3RGdWxsc2NyZWVuID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgKTtcblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBHb0luRnVsbHNjcmVlbihlbGVtZW50KSB7XG4gICAgaWYoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbilcbiAgICAgICAgZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgIGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbilcbiAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgIGVsc2UgaWYoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbilcbiAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgIGVsc2UgaWYoZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKVxuICAgICAgICBlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICB9XG5cblxuICAgICQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgd2luZG93WydvbllvdVR1YmVJZnJhbWVBUElSZWFkeSddID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkLmdldEpTT04oIFwianMvZGF0YS5qc29uXCIsIGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgICAgIHNldFNsaWRlcyhkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoc3VwcG9ydHNGdWxsU2NyZWVuKCkgJiYgd2luZG93LmlubmVyV2lkdGggPj0gMTAyNCl7XG4gICAgICAgICAgICBpY28uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59KSgpOyJdfQ==
    