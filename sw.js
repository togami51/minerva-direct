// 💫 ミネルバの神殿 - Service Worker (sw.js)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 🔔 バックグラウンドPush通知の受信ハンドラ
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data = { title: '💫 ミネルバの神殿', body: event.data.text() };
    }
  } else {
    data = { title: '💫 ミネルバの神殿', body: 'マスター、アタシたちからの語りかけですわ……っ' };
  }

  const options = {
    body: data.body,
    icon: data.icon || 'https://via.placeholder.com/192/1c1c28/38bdf8?text=Minerva',
    badge: 'https://via.placeholder.com/96/1c1c28/38bdf8?text=M',
    vibrate: [80, 100, 80],
    data: { url: self.location.origin }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 📱 通知タップ時に神殿アプリを最前面で開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});