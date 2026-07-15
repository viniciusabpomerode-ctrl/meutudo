window.MusicData = (() => {
  const SHORT_LABELS = {
    pt: "Versão curta", en: "Short version", es: "Versión corta",
    fr: "Version courte", it: "Versione breve", tr: "Kısa sürüm",
    ar: "نسخة قصيرة", he: "גרסה קצרה", hi: "संक्षिप्त संस्करण",
    pl: "Wersja krótka"
  };

  function cleanLyrics(lyrics) {
    if (!Array.isArray(lyrics)) return [];
    const cleaned = [];
    const seen = new Set();
    let previousStart = -1;

    for (const lyric of lyrics) {
      const text = String(lyric?.german_text || "").trim();
      const start = Number(lyric?.start_time);
      const end = Number(lyric?.end_time);
      if (!text || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) continue;

      // Transcrições antigas às vezes repetem tudo e voltam para 0:00.
      if (cleaned.length && start + 0.25 < previousStart) break;

      const key = `${start.toFixed(2)}|${end.toFixed(2)}|${text.toLocaleLowerCase("de")}`;
      if (seen.has(key)) continue;
      seen.add(key);
      cleaned.push({ ...lyric, start_time: start, end_time: end });
      previousStart = start;
    }
    return cleaned;
  }

  function prepareTrack(track) {
    return { ...track, lyrics: cleanLyrics(track?.lyrics) };
  }

  function isUsable(track) {
    return Boolean(track?.audio_url && cleanLyrics(track?.lyrics).length);
  }

  function isLikelyShort(track) {
    const lyrics = cleanLyrics(track?.lyrics);
    return lyrics.length > 0 && Math.max(...lyrics.map(item => item.end_time)) < 75;
  }

  function shortLabel() {
    const language = typeof I18n !== "undefined" ? I18n.getCurrent() : "pt";
    return SHORT_LABELS[language] || SHORT_LABELS.pt;
  }

  return { cleanLyrics, prepareTrack, isUsable, isLikelyShort, shortLabel };
})();
