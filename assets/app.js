const RUKN_CONFIG = {
  // Official contact destinations supplied by the owner.
  contacts: {
    whatsappUsername: 'RuknSales',
    telegramUsername: 'RuknSales',
    email: 'Sales@Ruknservers.com'
  },
  products: [
    {
      id: 'ae8-64-nvme-xl', family: 'amd', familyLabel: 'AMD EPYC',
      name: 'AE8-64 NVMe XL', tagline: 'Compact, fast NVMe compute for lean production workloads.',
      cpu: 'EPYC 4344P', threads: '8C / 16T', ram: '64GB ECC', storage: '2TB NVMe', price: 80,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: 'ar12-128-hdd', family: 'amd', familyLabel: 'AMD Ryzen PRO',
      name: 'AR12-128 HDD', tagline: 'Balanced core count and capacity for reliable everyday hosting.',
      cpu: 'Ryzen 9 PRO 3900', threads: '12C / 24T', ram: '128GB ECC', storage: '2TB HDD', price: 100,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: 'ae32-256-hdd', family: 'amd', familyLabel: 'AMD EPYC',
      name: 'AE32-256 HDD', tagline: 'High-capacity compute for sustained workloads.',
      cpu: 'EPYC 7543P', threads: '32C / 64T', ram: '256GB ECC', storage: '4TB HDD', price: 200,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: 'ae32-256-nvme', family: 'amd', familyLabel: 'AMD EPYC',
      name: 'AE32-256 NVMe', tagline: 'Fast local I/O for databases and active workloads.',
      cpu: 'EPYC 7543P', threads: '32C / 64T', ram: '256GB ECC', storage: '2TB NVMe', price: 220,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: 'ae16-128-hdd', family: 'amd', familyLabel: 'AMD EPYC',
      name: 'AE16-128 HDD', tagline: 'Balanced dedicated capacity for reliable production.',
      cpu: 'EPYC 7302P', threads: '16C / 32T', ram: '128GB ECC', storage: '4TB HDD', price: 120,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: 'ae16-128-nvme-xl', family: 'amd', familyLabel: 'AMD EPYC',
      name: 'AE16-128 NVMe XL', tagline: 'Responsive local storage and dedicated memory for active workloads.',
      cpu: 'EPYC 4545P', threads: '16C / 32T', ram: '128GB ECC', storage: '2TB NVMe', price: 150,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: '3xl-192-nvme', family: 'intel', familyLabel: 'Intel Xeon',
      name: '3XL-192 NVMe', tagline: 'Dedicated Xeon capacity with responsive NVMe storage.',
      cpu: 'Xeon Gold 6126', threads: '12C / 24T', ram: '192GB ECC', storage: '1TB NVMe', price: 100,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: '4xl-192-hdd', family: 'intel', familyLabel: 'Intel Xeon',
      name: '4XL-192 HDD', tagline: 'A dense Xeon platform with room for heavy services.',
      cpu: 'Xeon Gold 6210U', threads: '20C / 40T', ram: '192GB ECC', storage: '4TB HDD', price: 150,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: '4xl-192-nvme', family: 'intel', familyLabel: 'Intel Xeon',
      name: '4XL-192 NVMe', tagline: 'Xeon stability paired with responsive local storage.',
      cpu: 'Xeon Gold 6210U', threads: '20C / 40T', ram: '192GB ECC', storage: '2TB NVMe', price: 180,
      features: ['Dedicated', 'ECC memory', 'Root access']
    },
    {
      id: 'ix24-256-nvme', family: 'intel', familyLabel: 'Intel Xeon',
      name: 'IX24-256 NVMe', tagline: '24-core Xeon compute with fast local NVMe storage.',
      cpu: 'Xeon Gold 5412U', threads: '24C / 48T', ram: '256GB ECC', storage: '1.92TB NVMe', price: 220,
      features: ['Dedicated', 'ECC memory', 'Root access']
    }
  ]
};

const state = { filter: 'all', product: null, channel: null, opener: null };
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const money = (value) => `$${value}`;
const dialog = $('#orderDialog');

function productCard(product) {
  const icon = product.family === 'amd' ? '/assets/icons/amd.svg?v=2' : '/assets/icons/intel.svg?v=2';
  return `
    <article class="product-row" data-family="${product.family}">
      <div class="product-identity">
        <div class="product-kicker"><img class="family-logo" src="${icon}" alt="${product.familyLabel}" width="66" height="42" loading="lazy" decoding="async"><span>${product.familyLabel} / BARE METAL</span></div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.tagline}</p>
      </div>
      <div class="product-specs">
        <div class="spec"><span class="spec-label">Processor</span><strong class="spec-value">${product.cpu}</strong></div>
        <div class="spec"><span class="spec-label">Cores / threads</span><strong class="spec-value">${product.threads}</strong></div>
        <div class="spec"><span class="spec-label">Memory</span><strong class="spec-value">${product.ram}</strong></div>
        <div class="spec"><span class="spec-label">Storage</span><strong class="spec-value">${product.storage}</strong></div>
      </div>
      <div class="feature-line">${product.features.map((feature) => `<span>${feature}</span>`).join('')}</div>
      <div class="product-price"><div class="price">${money(product.price)} <small>/ mo</small></div><div class="price-note">All-in server price</div><button class="order-button" type="button" data-order="${product.id}" aria-label="Configure ${product.name} for ${money(product.price)} per month">Configure <span aria-hidden="true">↗</span></button></div>
    </article>`;
}

function renderCatalog() {
  const visible = RUKN_CONFIG.products
    .filter((product) => state.filter === 'all' || product.family === state.filter)
    .sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
  const amd = visible.filter((product) => product.family === 'amd');
  const intel = visible.filter((product) => product.family === 'intel');
  $('#amdGroup').hidden = !amd.length;
  $('#intelGroup').hidden = !intel.length;
  $('#amdList').innerHTML = amd.map(productCard).join('');
  $('#intelList').innerHTML = intel.map(productCard).join('');
  $('#totalCount').textContent = String(RUKN_CONFIG.products.length).padStart(2, '0');
  const sortLabel = state.filter === 'all' ? 'price ascending within each family' : 'price ascending';
  $('#catalogCount').textContent = `${visible.length} ${visible.length === 1 ? 'server' : 'servers'} · ${sortLabel}`;
}

function selectedCountry() {
  return $('input[name="country"]:checked')?.value || '';
}

function updateSelectionSummary() {
  const country = selectedCountry();
  const os = $('#os').value;
  const choices = [country, os].filter(Boolean);
  $('#selectionSummary').textContent = choices.length ? choices.join(' / ') : 'Choose your location and OS';
}

function selectOS(tile) {
  $$('.os-tile').forEach((item) => {
    const selected = item === tile;
    item.classList.toggle('selected', selected);
    $('.os-family-button', item).setAttribute('aria-pressed', String(selected));
  });
  $('.os-custom').classList.remove('selected');
  $('.os-custom').setAttribute('aria-pressed', 'false');
  $('#os').value = `${tile.dataset.osFamily} ${$('.os-version-select', tile).value}`;
  $('#formError').textContent = '';
  updateSelectionSummary();
}

function selectCustomOS() {
  $$('.os-tile').forEach((tile) => {
    tile.classList.remove('selected');
    $('.os-family-button', tile).setAttribute('aria-pressed', 'false');
  });
  $('.os-custom').classList.add('selected');
  $('.os-custom').setAttribute('aria-pressed', 'true');
  $('#os').value = 'Other / Custom';
  $('#formError').textContent = '';
  updateSelectionSummary();
}

function selectChannel(channel) {
  state.channel = channel;
  $$('.channel-card').forEach((button) => {
    const selected = button.dataset.channel === channel;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const names = { whatsapp: 'WhatsApp', telegram: 'Telegram', email: 'Email' };
  if (!channel) {
    $('#sendOrder').innerHTML = 'Choose a contact method <span aria-hidden="true">↗</span>';
    $('#sendOrder').disabled = true;
    return;
  }
  const configured = Boolean(RUKN_CONFIG.contacts[channel === 'whatsapp' ? 'whatsappUsername' : channel === 'telegram' ? 'telegramUsername' : 'email']);
  $('#sendOrder').innerHTML = `${configured ? 'Continue via' : 'Prepare for'} ${names[channel]} <span aria-hidden="true">↗</span>`;
  $('#sendOrder').disabled = false;
}

function openOrder(productId, button) {
  const product = RUKN_CONFIG.products.find((item) => item.id === productId);
  if (!product) return;
  state.product = product;
  state.opener = button;
  $('#orderTitle').textContent = product.name;
  $('#summaryServer').textContent = product.name;
  $('#summaryPrice').textContent = `${money(product.price)} / month`;
  $('#orderHardware').textContent = `${product.cpu} · ${product.threads} · ${product.ram} · ${product.storage}`;
  $$('input[name="country"]').forEach((input) => { input.checked = false; });
  $('#os').value = '';
  $$('.os-tile').forEach((tile) => {
    tile.classList.remove('selected');
    $('.os-family-button', tile).setAttribute('aria-pressed', 'false');
    $('.os-version-select', tile).selectedIndex = 0;
  });
  $('.os-custom').classList.remove('selected');
  $('.os-custom').setAttribute('aria-pressed', 'false');
  $('#formError').textContent = '';
  $('#formSuccess').replaceChildren();
  $('#formSuccess').classList.remove('visible');
  selectChannel(null);
  updateSelectionSummary();
  dialog.showModal();
}

function orderMessage() {
  const product = state.product;
  return [
    'Hello RUKN,', '',
    `I would like to enquire about ${product.name}.`,
    `Processor: ${product.cpu} (${product.threads})`,
    `Memory: ${product.ram}`,
    `Storage: ${product.storage}`,
    `All-in monthly price: ${money(product.price)} (chosen OS, including Windows Server licensing, taxes and setup included)`,
    `Location: ${selectedCountry()}`,
    `Operating system: ${$('#os').value}`, '',
    'Please confirm availability and provisioning details.'
  ].join('\n');
}

function showHandoff(message, link, linkText, fallbackText = '') {
  const box = $('#formSuccess');
  box.replaceChildren();
  const label = document.createElement('div');
  label.textContent = message;
  box.append(label);
  if (link) {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.textContent = linkText;
    if (!link.startsWith('mailto:')) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    box.append(anchor);
  }
  if (fallbackText) {
    const textarea = document.createElement('textarea');
    textarea.value = fallbackText;
    textarea.readOnly = true;
    textarea.setAttribute('aria-label', 'Prepared order message to copy');
    box.append(textarea);
  }
  box.classList.add('visible');
}

function sendOrder() {
  if (!state.product) return;
  const country = selectedCountry();
  const os = $('#os').value;
  if (!country) {
    $('#formError').textContent = 'Choose a server location to continue.';
    $('input[name="country"]').focus();
    return;
  }
  if (!os) {
    $('#formError').textContent = 'Choose an operating system to continue.';
    $('.os-family-button').focus();
    return;
  }
  if (!state.channel) {
    $('#formError').textContent = 'Choose a contact method to continue.';
    $('[data-channel]')?.focus();
    return;
  }
  $('#formError').textContent = '';
  const message = orderMessage();
  const destination = RUKN_CONFIG.contacts[state.channel === 'whatsapp' ? 'whatsappUsername' : state.channel === 'telegram' ? 'telegramUsername' : 'email'];
  if (!destination) {
    const notice = 'Your order details are ready. Official contact details are not connected yet; copy the message below and share it when RUKN publishes its contact route.';
    showHandoff(notice, null, '', message);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(message).then(
        () => {
          const box = $('#formSuccess');
          if ($('textarea', box)?.value === message) box.firstElementChild.textContent = `Copied to clipboard. ${notice}`;
        },
        () => {} // The selectable textarea is already visible as a fallback.
      );
    }
    return;
  }
  if (state.channel === 'telegram') {
    const link = `https://t.me/${RUKN_CONFIG.contacts.telegramUsername}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  } else if (state.channel === 'email') {
    const link = `mailto:${RUKN_CONFIG.contacts.email}?subject=${encodeURIComponent(`RUKN enquiry — ${state.product.name}`)}&body=${encodeURIComponent(message)}`;
    showHandoff('Your email draft is ready. If it does not open automatically, use the link here.', link, 'Open email draft ↗');
    window.location.href = link;
  } else {
    const link = `https://wa.me/${RUKN_CONFIG.contacts.whatsappUsername}?text=${encodeURIComponent(message)}`;
    showHandoff('Your WhatsApp message is ready. If a new tab did not open, use the link here.', link, 'Open WhatsApp ↗');
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}

$$('.filter-button').forEach((button) => button.addEventListener('click', () => {
  state.filter = button.dataset.filter;
  $$('.filter-button').forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderCatalog();
}));

// Delegation works even after the catalog is filtered and its rows are replaced.
document.addEventListener('click', (event) => {
  const orderButton = event.target.closest('[data-order]');
  if (orderButton) openOrder(orderButton.dataset.order, orderButton);
  if (event.target.closest('[data-close-order]')) dialog.close();
  const family = event.target.closest('.os-tile');
  if (family) selectOS(family);
  if (event.target.closest('.os-custom')) selectCustomOS();
  const channel = event.target.closest('[data-channel]');
  if (channel) selectChannel(channel.dataset.channel);
});

document.addEventListener('change', (event) => {
  if (event.target.matches('input[name="country"]')) {
    $('#formError').textContent = '';
    updateSelectionSummary();
  }
  const versionSelect = event.target.closest('.os-version-select');
  if (versionSelect) selectOS(versionSelect.closest('.os-tile'));
});
$('#sendOrder').addEventListener('click', sendOrder);
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => state.opener?.focus());
renderCatalog();
