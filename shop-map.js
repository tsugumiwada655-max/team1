(function () {
  const recommendedShops = [
    { name: 'Bistro Lien', area: '神楽坂', lat: 35.7027, lng: 139.7482, note: '季節の野菜を味わえるビストロ', tags: 'フレンチ・ランチ' },
    { name: 'PIZZERIA da Luca', area: '中目黒', lat: 35.6445, lng: 139.6993, note: '薪窯の香りが魅力のピザ', tags: 'イタリアン・夜ごはん' },
    { name: 'Cafe Mikan', area: '下北沢', lat: 35.6617, lng: 139.6687, note: 'くつろげるカフェとスイーツ', tags: 'カフェ・スイーツ' },
    { name: '鮨 まつもと', area: '恵比寿', lat: 35.6468, lng: 139.7103, note: '鮨の品質が安定しているお店', tags: '寿司・お祝い' }
  ];

  function renderMapList() {
    const mapList = document.getElementById('shop-map-list');
    if (!mapList) return;

    mapList.innerHTML = '';
    recommendedShops.forEach((shop) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'map-list-item';
      item.dataset.name = shop.name;
      item.innerHTML = `
        <span class="map-pin"></span>
        <span class="map-item-copy">
          <strong>${shop.name}</strong>
          <small>${shop.area}</small>
          <em>${shop.tags}</em>
        </span>`;
      item.addEventListener('click', () => focusShop(shop.name));
      mapList.appendChild(item);
    });
  }

  function focusShop(shopName) {
    const shop = recommendedShops.find((entry) => entry.name === shopName);
    if (!shop || !window.mapInstance) return;

    document.querySelectorAll('.map-list-item').forEach((button) => {
      button.classList.toggle('active', button.dataset.name === shopName);
    });

    window.mapInstance.flyTo([shop.lat, shop.lng], 14, { animate: true, duration: 1.1 });
    const marker = window.mapMarkers?.find((entry) => entry.shopName === shopName);
    if (marker) marker.openPopup();
  }

  function buildMap() {
    const mapContainer = document.getElementById('shop-map');
    if (!mapContainer || !window.L) return;

    const map = window.L.map('shop-map', {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([35.67, 139.7], 12);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    window.mapInstance = map;
    window.mapMarkers = [];

    recommendedShops.forEach((shop) => {
      const marker = window.L.marker([shop.lat, shop.lng]).addTo(map)
        .bindPopup(`<strong>${shop.name}</strong><br>${shop.area}<br>${shop.note}`);
      marker.shopName = shop.name;
      window.mapMarkers.push(marker);
    });

    const firstShop = recommendedShops[0];
    if (firstShop) focusShop(firstShop.name);
  }

  function initMapFeature() {
    const mapContainer = document.getElementById('shop-map');
    if (!mapContainer) return;

    renderMapList();

    if (window.L) {
      buildMap();
      return;
    }

    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.onload = buildMap;
    document.body.appendChild(leafletScript);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapFeature);
  } else {
    initMapFeature();
  }
})();
