const STORAGE_KEY = 'PIN_PROMPT_DATE';


Component({

  properties: {
    text: {
      type: String,
      value: '点击「添加小程序」，方便下次访问'
    },

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

    /**
     * 页面使用有导航栏
     * 
     */
    navbar: {
      type: Boolean,
      value: true,
    },

    logo: {
      type: String,
    },
    name: {
      type: String
    },

    duration: {
      type: Number,
      value: 0 // seconds
    }
  },


  data: {
    showHint: false,
    showBackdrop: false,

    top: 0,

    timer: null
  },

  attached: function () {
    if (!this.data.navbar) {
      const bound = wx.getMenuButtonBoundingClientRect()
      this.setData({
        top: bound.bottom
      })
    }

  },

  ready: function () {

    if (this.data.auto || this.data.show) {
      this.show();
    }
  },


  methods: {
    onTapBackdrop() {
      this.close()
    },

    onTapClose() {
      this.close()
    },

    show() {
      if (!this.shouldShow()) {
        return;
      }

      this.setData({
        showHint: true,
        showBackdrop: this.data.type === 'card'
      });

      if (this.data.type === 'bar' && this.data.duration > 0) {
        this.data.timer = setTimeout(() => {
          this.close();
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
      const alreadyShown = wx.getStorageSync(STORAGE_KEY)
      return !(this.data.auto && alreadyShown)
    }


  }
})