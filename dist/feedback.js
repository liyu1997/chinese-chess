(() => {
  const page = document.getElementById('settingsPage');
  if (!page) return;
  const copy = {
  "zh": [
    "意见反馈",
    "欢迎分享功能建议和使用中遇到的问题。",
    "提交成功即可解锁象力大师赛",
    "反馈类型",
    "功能建议",
    "问题反馈",
    "其他",
    "反馈内容",
    "请描述你的建议或遇到的问题。",
    "提交反馈",
    "正在提交…",
    "登录后提交，资格随账号保留。访客资格保留在当前浏览器。",
    "请填写至少 10 个有效字符，最多 2000 字。",
    "暂时未能提交，内容已保留，请稍后重试。",
    "反馈已收到，象力大师赛已解锁。",
    "进入象力大师赛 →",
    "你已提交过反馈，大师赛已解锁。",
    "登录状态已变化，请刷新后重试。"
  ],
  "en": [
    "Feedback",
    "Tell us what to improve or report a problem.",
    "Submit feedback to unlock Xiangli Masters",
    "Feedback type",
    "Suggestion",
    "Report a problem",
    "Other",
    "Your feedback",
    "Describe your suggestion or the issue you encountered.",
    "Submit feedback",
    "Sending…",
    "Signed-in eligibility follows your account. Guest eligibility stays in this browser.",
    "Enter at least 10 non-space characters and no more than 2,000 characters.",
    "Submission failed. Your text is still here. Please try again.",
    "Feedback received. Xiangli Masters is unlocked.",
    "Enter Xiangli Masters →",
    "You have already submitted feedback and unlocked the Masters.",
    "Your sign-in status changed. Refresh and try again."
  ],
  "es": [
    "Comentarios",
    "Cuéntanos qué podemos mejorar o informa de un problema.",
    "Envía tus comentarios y desbloquea Másters Xiangli",
    "Tipo de comentario",
    "Sugerencia",
    "Informar de un problema",
    "Otro",
    "Tu comentario",
    "Describe tu sugerencia o el problema que encontraste.",
    "Enviar comentario",
    "Enviando…",
    "Con sesión iniciada, el acceso se guarda en tu cuenta. Como invitado, se guarda en este navegador.",
    "Escribe al menos 10 caracteres sin contar espacios y un máximo de 2000 caracteres.",
    "No se pudo enviar. Tu texto sigue aquí. Inténtalo de nuevo.",
    "Comentario recibido. Másters Xiangli está desbloqueado.",
    "Entrar en Másters Xiangli →",
    "Ya enviaste comentarios y desbloqueaste el torneo.",
    "Tu sesión cambió. Recarga la página e inténtalo de nuevo."
  ]
};
  const t = index => (copy[window.MQI18n?.language] || copy.zh)[index];
  const api = 'https://tablegame.jujuli.com.cn/api/chess/feedback';
  const guestKey = 'mq-feedback-guest-v1';
  const receiptKey = 'mq-feedback-receipt-v1:';
  const receipts = new Set();
  const owner = () => window.MQRecords?.owner() ?? null;
  const randomId = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), byte => byte.toString(16).padStart(2, '0')).join('');
  let guestToken, retry, busy = false, messageIndex = null;

  function guestIdentity(create) {
    if (guestToken) return guestToken;
    try { guestToken = localStorage.getItem(guestKey); } catch {}
    if (!guestToken && create) {
      guestToken = randomId();
      try { localStorage.setItem(guestKey, guestToken); } catch {}
    }
    return guestToken;
  }

  function qualified(id) {
    if (receipts.has(id)) return true;
    try { return localStorage.getItem(receiptKey + id) === 'confirmed'; } catch { return false; }
  }

  function remember(id) {
    receipts.add(id);
    try { localStorage.setItem(receiptKey + id, 'confirmed'); } catch {}
  }

  async function request(path, data) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(api + path, {
        method: 'POST', credentials: 'include', cache: 'no-store',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data), signal: controller.signal
      });
      if (!response.ok) throw Object.assign(new Error('Feedback request failed'), {status: response.status});
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function hasSubmitted(id) {
    if (qualified(id)) return true;
    const token = id === 'guest' ? guestIdentity(false) : undefined;
    if (id === 'guest' && !token) return false;
    try {
      const result = await request('/status', {expectedOwner: id, guestToken: token});
      if (result.owner !== id || result.submitted !== true || !result.receipt?.id) return false;
      remember(id);
      return true;
    } catch { return false; }
  }

  const entry = document.createElement('button');
  entry.id = 'openFeedback';
  entry.type = 'button';
  entry.className = 'preference-row feedback-entry';
  entry.setAttribute('data-no-i18n', '');
  entry.innerHTML = '<strong></strong><span aria-hidden="true">›</span>';
  page.querySelector('.preferences-card').append(entry);

  const feedbackPage = document.createElement('main');
  feedbackPage.id = 'feedbackPage';
  feedbackPage.className = 'settings-page feedback-page';
  feedbackPage.hidden = true;
  feedbackPage.setAttribute('data-no-i18n', '');
  feedbackPage.innerHTML = '<div class="settings-top"><button type="button" class="back-home"></button></div><h1 tabindex="-1"></h1>';
  page.after(feedbackPage);

  const section = document.createElement('section');
  section.id = 'feedbackSection';
  section.className = 'preferences-card mq-feedback';
  section.setAttribute('data-no-i18n', '');
  section.innerHTML = `<p class="feedback-intro" data-copy="1"></p>
    <p class="feedback-reward" data-copy="2"></p>
    <form novalidate>
      <label for="feedbackType" data-copy="3"></label>
      <select id="feedbackType"><option value="suggestion" data-copy="4"></option><option value="problem" data-copy="5"></option><option value="other" data-copy="6"></option></select>
      <label for="feedbackMessage" data-copy="7"></label>
      <textarea id="feedbackMessage" rows="5" maxlength="4000" required aria-describedby="feedbackNote feedbackStatus"></textarea>
      <p id="feedbackNote" data-copy="11"></p>
      <div class="feedback-actions"><button class="feedback-submit" type="submit"></button><button class="feedback-go" type="button" data-copy="15" hidden></button></div>
    </form>
    <p id="feedbackStatus" role="status" hidden></p>`;
  feedbackPage.append(section);
  const heading = feedbackPage.querySelector('h1');
  const back = feedbackPage.querySelector('.back-home');

  const form = section.querySelector('form');
  const input = section.querySelector('textarea');
  const category = section.querySelector('select');
  const submit = section.querySelector('.feedback-submit');
  const enter = section.querySelector('.feedback-go');
  const status = section.querySelector('#feedbackStatus');

  function render() {
    entry.querySelector('strong').textContent = heading.textContent = t(0);
    const language = window.MQI18n?.language;
    back.textContent = language === 'en' ? '← Settings' : language === 'es' ? '← Ajustes' : '← 返回设置';
    for (const element of section.querySelectorAll('[data-copy]')) element.textContent = t(Number(element.dataset.copy));
    input.placeholder = t(8);
    submit.textContent = t(busy ? 10 : 9);
    submit.disabled = busy || owner() === null;
    input.disabled = category.disabled = busy;
    const unlocked = qualified(owner());
    enter.hidden = !unlocked;
    const displayedMessage = messageIndex ?? (unlocked ? 16 : null);
    status.hidden = displayedMessage === null;
    status.textContent = displayedMessage === null ? '' : t(displayedMessage);
    status.classList.toggle('feedback-error', [12,13,17].includes(displayedMessage));
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const id = owner();
    if (busy || id === null) return;
    const message = input.value.normalize('NFC').trim();
    if (Array.from(message.replace(/[\s\p{Cf}]/gu, '')).length < 10 || Array.from(message).length > 2000) {
      messageIndex = 12;
      render();
      input.focus();
      return;
    }
    const type = category.value;
    if (!retry || retry.owner !== id || retry.type !== type || retry.message !== message) {
      retry = {owner: id, type, message, requestId: randomId()};
    }
    busy = true;
    messageIndex = null;
    render();
    try {
      const result = await request('', {
        category: type, message, requestId: retry.requestId, expectedOwner: id,
        guestToken: id === 'guest' ? guestIdentity(true) : undefined
      });
      if (result.owner !== id || owner() !== id) throw Object.assign(new Error('Identity changed'), {status: 409});
      if (result.accepted !== true || result.mastersUnlocked !== true || !result.feedback?.id) throw new Error('Missing receipt');
      remember(id);
      input.value = '';
      retry = null;
      messageIndex = 14;
      window.dispatchEvent(new CustomEvent('mq-feedback-submitted'));
    } catch (error) {
      messageIndex = error.status === 409 ? 17 : 13;
    } finally {
      busy = false;
      render();
    }
  });

  async function sync() {
    render();
    if (document.body.dataset.page !== 'feedback') return;
    const id = owner();
    if (id !== null) await hasSubmitted(id);
    render();
  }

  const open = () => navigate('feedback');
  entry.onclick = open;
  back.onclick = () => navigate('settings');
  enter.onclick = () => navigate('masters');
  window.MQFeedback = {
    hasSubmitted,
    open,
    view(view) {
      const wasOpen = !feedbackPage.hidden;
      feedbackPage.hidden = view !== 'feedback';
      if (view === 'feedback') {
        if (!wasOpen) heading.focus({preventScroll: true});
        sync();
      } else if (wasOpen && view === 'settings') {
        entry.focus({preventScroll: true});
      }
    }
  };
  window.addEventListener('mq-language', render);
  window.addEventListener('mq-auth', () => {
    messageIndex = null;
    queueMicrotask(sync);
  });
  window.MQRecords?.ready.then(sync);
  render();
})();
