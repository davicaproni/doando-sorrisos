const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
  menuToggle.textContent = expanded ? '×' : '☰';
  navigation.classList.toggle('open', expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  menuToggle.textContent = '☰';
}));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navigation.querySelectorAll('a').forEach(link => {
      const current = link.hash === `#${entry.target.id}`;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('selected', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter;
  });
}));
let toastTimeout;
function notify(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 4500);
}
document.querySelector('#share-campaign').addEventListener('click', async () => {
  const url = 'https://doando-sorrisos.vercel.app/';
  try {
    await navigator.clipboard.writeText(url);
    notify('Link copiado! Compartilhe com quem pode ajudar.');
  } catch {
    window.prompt('Copie o link para compartilhar a campanha:', url);
  }
});
const dialog = document.querySelector('#participation-dialog');
const type = document.querySelector('#participation-type');
const guidance = document.querySelector('#participation-guidance');
const orientations = {
  materiais: ['Consulte a escola sobre a lista atualizada.', 'Separe materiais limpos, completos e em bom estado.', 'Combine presencialmente o local e o horário da entrega.'],
  brinquedos: ['Confirme os brinquedos necessários com a escola.', 'Separe brinquedos adequados a crianças de 0 a 3 anos, sem peças pequenas ou danificadas.', 'Entregue os itens limpos e completos, em horário combinado.'],
  pedagogicos: ['Confirme com a escola quais recursos pedagógicos são necessários.', 'Separe livros e materiais completos e em bom estado, adequados à primeira infância.', 'Combine a entrega presencialmente com a escola.'],
  arte: ['Confirme os materiais de desenho e pintura solicitados.', 'Verifique a indicação etária, a validade e a segurança dos produtos.', 'Combine com a escola como e quando entregar.'],
  espacos: ['Consulte a escola antes de separar itens para os ambientes.', 'Confirme as especificações e condições de segurança exigidas.', 'Combine o transporte e a entrega diretamente com a instituição.'],
  voluntario: ['Converse presencialmente com a escola sobre as ações da campanha.', 'Informe quais habilidades e horários você pode oferecer.', 'Aguarde a orientação da instituição antes de iniciar qualquer atividade.']
};
function updateGuidance() {
  guidance.replaceChildren();
  const title = document.createElement('strong');
  title.textContent = 'Seu próximo passo';
  const list = document.createElement('ul');
  orientations[type.value].forEach(text => {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  });
  guidance.append(title, list);
}
document.querySelectorAll('[data-participate]').forEach(button => button.addEventListener('click', () => {
  type.value = button.dataset.participate;
  updateGuidance();
  dialog.showModal();
}));
type.addEventListener('change', updateGuidance);
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelector('#download-guide').addEventListener('click', () => {
  const text = `DOANDO SORRISOS | CAMPANHA SOLIDÁRIA\nEMEB Sociólogo Herbert de Souza — Diadema/SP\n\nQuero ajudar com: ${type.options[type.selectedIndex].text}\n\n${orientations[type.value].map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nA lista e o recebimento devem ser confirmados diretamente com a escola. Este documento é uma orientação, não uma confirmação de doação ou agendamento.\nNão é necessário cadastro.\n`;
  download(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }), 'orientacao-doando-sorrisos.txt');
  notify('Orientação preparada para baixar. Obrigado por querer ajudar!');
});
