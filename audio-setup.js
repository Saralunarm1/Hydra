// Hydra audio setup · Creative Code
// Load it at the top of a Hydra patch with:
//   await loadScript("https://cdn.jsdelivr.net/gh/Saralunarm1/Hydra@main/audio-setup.js")
//   loadSong("https://raw.githubusercontent.com/USER/REPO/main/your-song.mp3")
// Then use bass(), mids(), highs() and energy() anywhere in a patch, inside () =>
// Click anywhere on the page to start the music · Esc pauses and plays again
// Run loadSong again with another link to switch songs, no reload needed

(() => {
  if (window.loadSong) return // already loaded on this page

  let actx, analyser, data

  // average of a range of frequency slices, from 0 to 1
  let avg = (a, b) => {
    if (!analyser) return 0
    analyser.getByteFrequencyData(data)
    let t = 0
    for (let i = a; i < b; i++) t += data[i]
    return t / ((b - a) * 255)
  }

  window.bass = () => Math.pow(avg(1, 6), 3)          // kick and bass
  window.mids = () => avg(8, 30)                      // melody and voices
  window.highs = () => Math.min(1, avg(30, 60) * 2.5) // hi-hats and cymbals
  window.energy = () => avg(1, 60)                    // overall loudness

  let start = () => {
    if (actx) actx.resume()
    if (window.song) window.song.play()
  }
  window.toggleSong = () => {
    if (!window.song) return
    if (window.song.paused) start()
    else window.song.pause()
  }

  window.loadSong = (url) => {
    if (!window.song) {
      window.song = new Audio()
      window.song.crossOrigin = 'anonymous'
      window.song.loop = true
      actx = new AudioContext()
      analyser = actx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.7
      data = new Uint8Array(analyser.frequencyBinCount)
      let source = actx.createMediaElementSource(window.song)
      source.connect(analyser)
      source.connect(actx.destination)
      // the browser only allows sound after a click or a key
      window.addEventListener('pointerdown', start, { once: true })
      window.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.toggleSong() }, true)
    }
    if (window.song.src !== url) {
      let playing = !window.song.paused
      window.song.src = url
      if (playing) start()
    }
  }
})()
