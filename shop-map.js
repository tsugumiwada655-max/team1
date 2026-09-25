(function () {
  const recommendedShops = [
    { name: 'Bistro Lien', area: '神楽坂', note: '季節の野菜を味わえるビストロ', tags: 'フレンチ・ランチ' },
    { name: 'PIZZERIA da Luca', area: '中目黒', note: '薪窯の香りが魅力のピザ', tags: 'イタリアン・夜ごはん' },
    { name: 'Cafe Mikan', area: '下北沢', note: 'くつろげるカフェとスイーツ', tags: 'カフェ・スイーツ' },
    { name: '鮨 まつもと', area: '恵比寿', note: '鮨の品質が安定しているお店', tags: '寿司・お祝い' }
  ];

  function googleMapsEmbedUrl(shop) {
    const query = encodeURIComponent(`${shop.name} ${shop.area}`);
    return `https://www.google.com/maps?q=${query}&z=14&output=embed`;
  }

  function renderMapList() {
    const list = document.getElementById('shop-map-list');
    if (!list) return;

    list.innerHTML = recommendedShops.map((shop) => `
      <button class="map-list-item" type="button" data-name="${shop.name}">
        <span class="map-pin"></span>
        <span class="map-item-copy">
          <strong>${shop.name}</strong>
          <small>${shop.area}</small>
          <em>${shop.tags}</em>
        </span>
      </button>
    `).join('');

    list.querySelectorAll('.map-list-item').forEach((button) => {
      button.addEventListener('click', () => focusShop(button.dataset.name));
    });
  }

  function focusShop(shopName) {
    const iframe = document.getElementById('shop-map');
    const shop = recommendedShops.find((entry) => entry.name === shopName) || recommendedShops[0];
    if (!iframe || !shop) return;

    iframe.src = googleMapsEmbedUrl(shop);
    document.querySelectorAll('.map-list-item').forEach((button) => {
      button.classList.toggle('active', button.dataset.name === shop.name);
    });
  }

  function initMapFeature() {
    const map = document.getElementById('shop-map');
    if (!map) return;

    renderMapList();
    focusShop(recommendedShops[0].name);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapFeature);
  } else {
    initMapFeature();
  }
})();
