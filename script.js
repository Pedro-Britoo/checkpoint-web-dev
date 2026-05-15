document.getElementById('ano').textContent = new Date().getFullYear();


(function() {
  var display  = document.getElementById('contadorDisplay');
  var btn      = document.getElementById('btnContador');
  var contador = 0;

  btn.addEventListener('click', function() {
    contador++;
    display.textContent = contador;

    if (contador % 5 === 0) {
      btn.textContent      = '🎉 ' + contador + ' cliques!';
      btn.style.background = '#22c55e';
    } else {
      btn.textContent      = 'Clique aqui!';
      btn.style.background = '';
    }
  });
}());


(function() {
  var form     = document.getElementById('formContato');
  var feedback = document.getElementById('formFeedback');
  var re       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var nome  = document.getElementById('nome').value.trim();
    var email = document.getElementById('email').value.trim();
    var msg   = document.getElementById('mensagem').value.trim();

    if (!nome) {
      mostrarFeedback(feedback, 'Informe seu nome.', 'erro');
      return;
    }
    if (!re.test(email)) {
      mostrarFeedback(feedback, 'E-mail inválido.', 'erro');
      return;
    }
    if (msg.length < 5) {
      mostrarFeedback(feedback, 'Mensagem muito curta.', 'erro');
      return;
    }

    mostrarFeedback(feedback, '✓ Mensagem enviada! Obrigado, ' + nome + '.', 'ok');
    form.reset();
  });

  function mostrarFeedback(el, texto, tipo) {
    el.textContent = texto;
    el.className   = 'form__feedback form__feedback--' + tipo;
  }
}());


(function() {
  var secoes = document.querySelectorAll('section[id]');
  var links  = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', function() {
    var atual = '';

    secoes.forEach(function(s) {
      if (window.scrollY >= s.offsetTop - 100) atual = s.id;
    });

    links.forEach(function(link) {
      link.classList.toggle('nav__link--ativo', link.getAttribute('href') === '#' + atual);
    });
  });
}());

(function() {
  var cards = document.querySelectorAll('.card');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('card--visivel');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function(card) { observer.observe(card); });
}());

(function() {
  var display       = document.getElementById('calcDisplay');
  var valorAtual    = '0';
  var valorAnterior = '';
  var operador      = null;
  var esperandoNovo = false;

  function atualizar(v) { display.textContent = v; }

  function digitarNumero(n) {
    if (esperandoNovo) {
      valorAtual    = n === '.' ? '0.' : n;
      esperandoNovo = false;
    } else {
      if (n === '.' && valorAtual.includes('.')) return;
      valorAtual = valorAtual === '0' && n !== '.' ? n : valorAtual + n;
    }
    atualizar(valorAtual);
  }

  function definirOperador(op) {
    if (operador && !esperandoNovo) calcular();
    valorAnterior = valorAtual;
    operador      = op;
    esperandoNovo = true;
    document.querySelectorAll('.calc__btn--op').forEach(function(b) {
      b.classList.toggle('calc__btn--op-ativo', b.dataset.op === op);
    });
  }

  function calcular() {
    if (!operador || esperandoNovo) return;
    var a = parseFloat(valorAnterior);
    var b = parseFloat(valorAtual);
    var r;
    if      (operador === '+') r = a + b;
    else if (operador === '-') r = a - b;
    else if (operador === '*') r = a * b;
    else if (operador === '/') r = b !== 0 ? a / b : 'Erro';
    valorAtual    = typeof r === 'number' ? parseFloat(r.toPrecision(10)).toString() : r;
    operador      = null;
    esperandoNovo = false;
    document.querySelectorAll('.calc__btn--op').forEach(function(b) {
      b.classList.remove('calc__btn--op-ativo');
    });
    atualizar(valorAtual);
  }

  document.getElementById('calcTeclado').addEventListener('click', function(e) {
    var btn  = e.target.closest('button');
    if (!btn) return;
    var acao = btn.dataset.acao;
    var num  = btn.dataset.num;
    var op   = btn.dataset.op;

    if      (num  !== undefined)         { digitarNumero(num); }
    else if (op)                          { definirOperador(op); }
    else if (acao === 'igual')            { calcular(); }
    else if (acao === 'sinal')            { valorAtual = (parseFloat(valorAtual) * -1).toString(); atualizar(valorAtual); }
    else if (acao === 'porcentagem')      { valorAtual = (parseFloat(valorAtual) / 100).toString(); atualizar(valorAtual); }
    else if (acao === 'limpar') {
      valorAtual = '0'; valorAnterior = ''; operador = null; esperandoNovo = false;
      document.querySelectorAll('.calc_btn--op').forEach(function(b) { b.classList.remove('calc_btn--op-ativo'); });
      atualizar('0');
    }
  });
}());
