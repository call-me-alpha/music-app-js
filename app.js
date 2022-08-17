const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn =$('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const APP_MUSIC_STORAGE_KEY = 'ALPHAISME'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(APP_MUSIC_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Phi Hành Gia',
            singer: 'Renja, Slow T, Lil Wuyn, Kain, Sugar Cane',
            path: './assets/music/Phi-Hanh-Gia.mp3',
            image: './assets/images/Phi-Hanh-Gia.jpg'
        },
        {
            name: 'Độ Tộc 2',
            singer: 'Độ Mixi, Pháo, Phúc Du, Masew',
            path: './assets/music/Do-Toc-2.mp3',
            image: './assets/images/Do-Toc-2.jpg'
        },
        {
            name: 'Sofar',
            singer: 'Binz',
            path: './assets/music/Sofar.mp3',
            image: './assets/images/Sofar.jpg'
        },
        {
            name: 'Lạc',
            singer: 'Rhymastic',
            path: './assets/music/Lac.mp3',
            image: './assets/images/Lac.jpg'
        },
        {
            name: 'Thủ Đô Cypher',
            singer: 'Rapital, RPT Orijinn, Low G, RZ Ma$',
            path: './assets/music/Thu-Do-Cypher.mp3',
            image: './assets/images/Thu-Do-Cypher.jpg'
        },
        {
            name: 'Ok',
            singer: 'Binz',
            path: './assets/music/Ok.mp3',
            image: './assets/images/Ok.jpg'
        },
        {
            name: 'Váy Cưới',
            singer: 'Trung Tự',
            path: './assets/music/Vay-Cuoi.mp3',
            image: './assets/images/Vay-Cuoi.jpg'
        },
        {
            name: 'Back To Hometown',
            singer: 'Sol7',
            path: './assets/music/Back-To-Hometown.mp3',
            image: './assets/images/Back-To-Hometown.jpg'
        },
        {
            name: 'Bên Trên Tầng Lầu',
            singer: 'Tăng Duy Tân',
            path: './assets/music/Ben-Tren-Tang-Lau.mp3',
            image: './assets/images/Ben-Tren-Tang-Lau.jpg'
        },
        {
            name: 'Vì Mẹ Anh Bắt Chia Tay',
            singer: 'Miu Lê, Karik, Châu Đăng Khoa',
            path: './assets/music/Vi-Me-Anh-Bat-Chia-Tay.mp3',
            image: './assets/images/Vi-Me-Anh-Bat-Chia-Tay.jpg'
        },
        {
            name: 'Bắt Cóc Con Tim',
            singer: 'OnlyC',
            path: './assets/music/Bat-Coc-Con-Tim.mp3',
            image: './assets/images/Bat-Coc-Con-Tim.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(APP_MUSIC_STORAGE_KEY, JSON.stringify(this.config))
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    handelEvent: function() {
        _this = this

        // Xủ lí quay /dừng CD
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        
        // Xử lí phóng to thu nhỏ CD
        const cdWith = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWith = cdWith - scrollTop
            cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0
            cd.style.opacity = newCdWith / cdWith
        }
        // Xủ lí play / pause song
        playBtn.onclick = function() {
            _this.isPlaying ? audio.pause() : audio.play()
        }
        // Khi audio play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi audio bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // Khi tiến độ song thay đổi
        audio.ontimeupdate = function() {
            progressPercent = Math.floor(this.currentTime / this.duration * 100)
            if(progressPercent) {
                progress.value = progressPercent
            } else if(progressPercent = 100) {
                progress.value = 0
            }
        }
        // Xử lí khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // Xử lí khi next song
        nextBtn.onclick = function() {
            _this.isRandom ? _this.randomSong() : _this.nextSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Xử lí khi prev song
        prevBtn.onclick = function() {
            _this.isRandom ? _this.randomSong() : _this.prevSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Xử lí khi next song khi audio ended
        audio.onended = function() {
            _this.isRepeat ? this.play() : nextBtn.click()
        }
        // Xử lí random Song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            this.classList.toggle('active', _this.isRandom)
        }
        // Xử lí khi turn repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            this.classList.toggle('active', _this.isRepeat)
        }
        // Xử lí khi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // Xử lí kho click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lí khi click vào option
                if(e.target.closest('.option')) {
                    
                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },200)
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) this.currentIndex = 0
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex <= 0) this.currentIndex = this.songs.length - 1
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex = this.currentIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    start: function() {
        // Gán cấu hình từ config vào app
        this.loadConfig()
        // Định nghĩa cái thuộc tính cho Object
        this.defineProperties()
        // Lắng nghe/ Xử lí các sự kiện (DOM Event)
        this.handelEvent()
        // Render playlist
        this.render()
        // Load thông tin bài hát đầu tiền UI
        this.loadCurrentSong()
        // Hiển thị lại setting
        randomBtn.classList.toggle('active', _this.isRandom)
        repeatBtn.classList.toggle('active', _this.isRepeat)
    }
}

app.start();