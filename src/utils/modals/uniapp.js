/**
 * @desc uni pop-up
 * @param {*} content
 * @param {*} param1
 */
export function useDialog(
  content,
  {
    title = 'Hint',
    showCancelButton = false,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    ...moreOptions
  } = {},
) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title,
      content,
      confirmText: confirmButtonText,
      cancelText: cancelButtonText,
      showCancel: showCancelButton,
      ...moreOptions,
      success({ cancel }) {
        if (cancel) {
          reject(new Error('cancel'))
        }

        resolve({ type: 'confirm' })
      },
    })
  })
}

/**
 * @desc uni Light Tips
 * @param {*} content
 * @param {*} options Extended Parameters
 */
export function useToast(
  content,
  {
    position = 'center',
    duration = 1000,
    overlay = true,
    icon = 'none',
    ...moreOptions
  } = {},
) {
  if (!content) {
    uni.hideToast()
    return
  }

  uni.showToast({
    title: content,
    position,
    duration,
    mask: overlay,
    icon,
    ...moreOptions,
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(uni)
    }, duration)
  })
}

/**
 * @desc Show or hide loading
 * @param {*} content
 * @param {*} options
 */
export function useLoading(content, { overlay = true, ...moreOptions } = {}) {
  if (content && typeof content === 'boolean') {
    content = 'Loading...'
  }

  if (!content) {
    uni.hideLoading()
    return
  }

  uni.showLoading({
    title: content,
    mask: overlay,
    ...moreOptions,
  })
}
