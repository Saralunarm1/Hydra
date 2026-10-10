// Hydra keys setup · Creative Code
// Load it at the top of a Hydra patch with:
//   await loadScript("https://cdn.jsdelivr.net/gh/Saralunarm1/Hydra@main/keys-setup.js")
// Ctrl+Shift+H hides the code: then your keys control the visuals
// Ctrl+Shift+H again shows the code: then your keys type as usual
//
//   on.Space        flips between true and false with each press
//   held.KeyF       true only while the key is held down
//   glide('Space')  fades between 0 and 1 instead of jumping
//   onKey = (k) => { ... }   runs your own action on every key press

(() => {
  if (window.keysReady) return // already loaded on this page
  window.keysReady = true
  window.on = {}
  window.held = {}
  let lvl = {}

  window.glide = (k, speed = 0.08) => () => {
    lvl[k] = (lvl[k] || 0) + ((window.on[k] ? 1 : 0) - (lvl[k] || 0)) * speed
    return lvl[k]
  }

  // true while the Hydra code is hidden with Ctrl+Shift+H
  let codeHidden = () => {
    let e = document.querySelector('.cm-editor, .CodeMirror')
    while (e) {
      if (e.style.opacity === '0') return true
      e = e.parentElement
    }
    return false
  }

  window.addEventListener('keydown', (e) => {
    if (!codeHidden() || e.ctrlKey || e.metaKey || e.altKey) return
    e.preventDefault()
    e.stopPropagation()
    if (e.repeat) return
    window.on[e.code] = !window.on[e.code]
    window.held[e.code] = true
    if (window.onKey) window.onKey(e.code, window.on[e.code])
  }, true)

  window.addEventListener('keyup', (e) => { window.held[e.code] = false }, true)
})()
