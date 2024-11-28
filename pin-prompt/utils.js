
export async function checkIsAdded() {
  return new Promise((resolve, reject) => {
    if (!wx.checkIsAddedToMyMiniProgram) {
      resolve(null)
    }
    wx.checkIsAddedToMyMiniProgram({
      success: (res) => {
        resolve(res.added)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}