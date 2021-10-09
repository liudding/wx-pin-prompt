const STORAGE_KEY = 'PIN_PROMPT_DATE';

Component({
  properties: {
    text: {
      type: String,
      value: '点击「添加小程序」，方便下次访问'
    },

    /**
     * 展示类型
     */
    type: {
      type: String,
      value: 'bar' // bar, card
    },

    show: {
      type: Boolean,
      value: false,
      observer: function (val) {
        val && this.show();
        !val && this.close()
      }
    },

    showDetail: {
      type: Boolean,
      value: false,
      observer: function (val) {
        val && this.showDetail();
      }
    },

    auto: {
      type: Boolean,
      value: false,
    },

    background: {
      type: String,
      value: '#fff'
    },

    color: {
      type: String,
      value: '#000'
    },

    /**
     * 页面使用了自定义导航栏
     */
    customNavbar: {
      type: Boolean,
      value: false,
    },

    logo: {
      type: String,
    },
    name: {
      type: String
    },

    /**
     * 展示时长
     */
    duration: {
      type: Number,
      value: 5 // seconds
    }
  },

  data: {
    showHint: false,
    showBackdrop: false,

    position: {
      top: 0,
      right: 0
    },

    timer: null
  },

  lifetimes: {
    attached: function () {
      this._attached();
    },
  },

  pageLifetimes: {
    resize: function(size) {
      // 页面尺寸变化
      this._updatePosition()
    }
  },

  attached: function () {
    this._attached();
  },

  methods: {
    onTapBackdrop() {
      this.close()
    },

    onTapClose() {
      this.close()
    },

    show() {
      this.setData({
        showHint: true,
        showBackdrop: this.data.type === 'card'
      });

      if (this.data.type === 'bar' && this.data.duration > 0) {
        this.data.timer = setTimeout(() => {
          if (this.data.type === 'bar') {
            this.close();
          }
        }, this.data.duration * 1000)
      }
    },

    close() {
      this.setData({
        showHint: false,
        showBackdrop: false
      });

      wx.setStorageSync(STORAGE_KEY, Date.now())
    },

    showDetail: function () {
      this.data.timer && clearTimeout(this.data.timer)

      this.setData({
        showHint: true,
        showBackdrop: true,
        type: 'card'
      });
    },

    shouldShow() {
      if (this.data.auto) {
        const alreadyShown = wx.getStorageSync(STORAGE_KEY)

        return !alreadyShown;
      }

      return this.data.show;
    },

    _attached() {
      this._updatePosition()

      if (this.shouldShow()) {
        this.show();
      }
    },

    _updatePosition() {
      const isSupport = !!wx.getMenuButtonBoundingClientRect
      const rect = isSupport ? wx.getMenuButtonBoundingClientRect() : {}

      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            position: {
              top: this.data.customNavbar ? rect.bottom : 0,
              right: res.screenWidth - rect.left - rect.width * 3 / 4
            }
          })
        }
      })

    }
  }
})