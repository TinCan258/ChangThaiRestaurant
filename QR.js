document.addEventListener('DOMContentLoaded', () => {
  const metaBase = document.querySelector('meta[name="site-base"]')?.content?.trim() || '';

  document.querySelectorAll('.qr-box').forEach(box => {
    const imgContainer = box.querySelector('.qr-image');
    if (!imgContainer) return;

    // 1) data-url ưu tiên (toàn bộ URL)
    let target = imgContainer.dataset.url && imgContainer.dataset.url.trim() !== ''
      ? imgContainer.dataset.url.trim()
      : '';

    // 2) nếu không có data-url, dùng meta base + data-file (tên file) hoặc current filename
    if (!target && metaBase) {
      const fileFromAttr = imgContainer.dataset.file && imgContainer.dataset.file.trim() !== ''
        ? imgContainer.dataset.file.trim()
        : (location.pathname.split('/').pop() || 'index.html');
      try {
        target = new URL(fileFromAttr, metaBase.endsWith('/') ? metaBase : metaBase + '/').toString();
      } catch (e) {
        target = metaBase + (metaBase.endsWith('/') ? '' : '/') + fileFromAttr;
      }
    }

    // 3) fallback dùng window.location.href
    if (!target) target = window.location.href;

    const size = imgContainer.dataset.size || '240x240';
    const src = 'https://api.qrserver.com/v1/create-qr-code/?size=' + encodeURIComponent(size) + '&data=' + encodeURIComponent(target);

    imgContainer.innerHTML = '';

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Mã QR dẫn tới: ' + target;
    img.loading = 'lazy';
    img.width = parseInt(size.split('x')[0], 10) || 240;
    img.height = parseInt(size.split('x')[1], 10) || 240;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '8px';
    img.style.background = '#fff';
    img.style.padding = '6px';
    img.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
    img.setAttribute('aria-hidden', 'false');
    imgContainer.appendChild(img);

    const dl = document.createElement('a');
    dl.href = src;
    dl.download = 'qr-' + (location.pathname.split('/').pop() || 'page') + '.png';
    dl.textContent = 'Tải mã QR';
    dl.className = 'qr-download';
    dl.style.display = 'inline-block';
    dl.style.marginTop = '8px';
    dl.style.color = 'var(--accent)';
    dl.style.fontWeight = '700';
    imgContainer.appendChild(dl);
  });
});