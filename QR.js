document.addEventListener('DOMContentLoaded', () => {
  const metaBase = document.querySelector('meta[name="site-base"]')?.content?.trim();

  document.querySelectorAll('.qr-box').forEach(box => {
    const imgContainer = box.querySelector('.qr-image');
    if (!imgContainer) return;

    let target = (imgContainer.dataset.url && imgContainer.dataset.url.trim() !== '')
      ? imgContainer.dataset.url.trim()
      : '';

    if (!target) {
      if (metaBase) {
        const filename = (location.pathname || '').split('/').pop() || '';
        target = metaBase.endsWith('/') ? (metaBase + filename) : (metaBase + '/' + filename);
      } else if (location.protocol && location.protocol.startsWith('http')) {
        target = window.location.href;
      } else {
        // fallback — yêu cầu người dùng đặt meta site-base hoặc data-url
        console.error('QR generation: no target URL. Add <meta name="site-base"> in <head> or set data-url on .qr-image.');
        return;
      }
    }

    const size = imgContainer.dataset.size || '240x240';
    const src = 'https://api.qrserver.com/v1/create-qr-code/?size=' + encodeURIComponent(size) + '&data=' + encodeURIComponent(target);

    imgContainer.innerHTML = '';

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Mã QR dẫn tới: ' + target;
    img.loading = 'lazy';
    img.width = parseInt(size.split('x')[0], 10) || 240;
    img.height = parseInt(size.split('x')[1], 10) || 240;
    img.style.display = 'block';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '8px';
    img.style.background = '#fff';
    img.style.padding = '6px';
    img.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
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