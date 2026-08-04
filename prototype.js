(function () {
  'use strict';

  var root = document.querySelector('.prototype');
  if (!root) return;

  var variant = root.getAttribute('data-variant');
  var players = [
    { name: 'Kylian Mbappe', team: 'France', flag: 'fr', odds: ['3,35', '10,30'], primary: ['1,63', '3,10', '3,10'] },
    { name: 'Marcus Thuram', team: 'France', flag: 'fr', odds: ['6,50', '30'], primary: ['2,30', '4,75', '4,75'] },
    { name: 'Jean Philippe Mateta', team: 'France', flag: 'fr', odds: ['7,00', '35'], primary: ['2,30', '4,75', '4,75'] },
    { name: 'Ousmane Dembele', team: 'France', flag: 'fr', odds: ['7,00', '35'], primary: ['2,30', '4,75', '4,75'] },
    { name: 'Jonathan David', team: 'Canada', flag: 'ca', odds: ['10,50', '65'], primary: ['4,55', '8,00', '8,00'] },
    { name: 'Desire Doue', team: 'France', flag: 'fr', odds: ['10,50', '65'], primary: ['2,90', '6,00', '6,00'] },
    { name: 'Michael Olise', team: 'France', flag: 'fr', odds: ['10,50', '65'], primary: ['2,90', '6,00', '6,00'] },
    { name: 'Promise David', team: 'Canada', flag: 'ca', odds: ['10,50', '65'], primary: ['2,90', '6,00', '6,00'] },
    { name: 'Tani Oluwaseyi', team: 'Canada', flag: 'ca', odds: ['10,50', '65'], primary: ['2,90', '6,00', '6,00'] },
    { name: 'Adrien Rabiot', team: 'France', flag: 'fr', odds: ['10,50', '65'], primary: ['2,90', '6,00', '6,00'] }
  ];
  var selectedTeam = 'Tous';
  var selectedPlayer = null;
  var selectedOdds = 0;
  var expandedMarkets = {};
  var selectedOddKeys = {};

  function flag(player) {
    return player.flag === 'ca'
      ? '<span class="flag flag-ca" aria-label="Canada"><img src="figma-assets/canada.svg" alt=""></span>'
      : '<span class="flag flag-fr" aria-label="France"><img class="flag-image" src="https://www.figma.com/api/mcp/asset/d63b43ac-c39d-4652-b1fc-7682de5315e0" alt=""></span>';
  }

  function odds(value, key) {
    var chosen = key && selectedOddKeys[key];
    var isGoalTrigger = variant === 'player-filter' && key === 'primary-Desire Doue-0';
    return '<button type="button" class="player-odds' + (chosen ? ' is-selected' : '') + '" data-odd-key="' + (key || '') + '"' + (isGoalTrigger ? ' data-goal-trigger' : ' aria-disabled="true"') + ' aria-label="Cote ' + value + '"><span class="odds-value">' + value + '</span></button>';
  }

  function visiblePlayers() {
    return players.filter(function (player) {
      return (selectedTeam === 'Tous' || player.team === selectedTeam) && (!selectedPlayer || player.name === selectedPlayer);
    });
  }

  function updateMoreButton(name, total, defaultLimit) {
    var button = root.querySelector('[data-more="' + name + '"]');
    if (!button) return;
    button.hidden = total <= defaultLimit;
    button.textContent = expandedMarkets[name] ? 'Afficher moins' : 'Afficher plus';
  }

  function renderPrimaryPlayers() {
    var list = root.querySelector('[data-primary-players]');
    if (!list) return;
    var visible = visiblePlayers();
    var defaultLimit = selectedPlayer ? 1 : 5;
    var limit = expandedMarkets.primary ? visible.length : defaultLimit;
    list.innerHTML = visible.slice(0, limit).map(function (player) {
      return '<div class="primary-player-row" data-player="' + player.name + '">' +
        '<div class="player-name">' + flag(player) + '<span>' + player.name + '</span></div>' +
        '<div class="primary-bet-compo">' +
        odds(player.primary[0], 'primary-' + player.name + '-0') +
        odds(player.primary[1], 'primary-' + player.name + '-1') +
        odds(player.primary[2], 'primary-' + player.name + '-2') +
        '</div>' +
      '</div>';
    }).join('') || '<p class="empty">Aucun joueur ne correspond a ce filtre.</p>';
    updateMoreButton('primary', visible.length, defaultLimit);
    bindOdds(list);
  }

  function renderPlayers() {
    var list = root.querySelector('[data-players]');
    if (!list) return;
    var visible = visiblePlayers();
    var defaultLimit = selectedPlayer ? 1 : 5;
    var limit = expandedMarkets.multiple ? visible.length : defaultLimit;
    list.innerHTML = visible.slice(0, limit).map(function (player) {
      return '<div class="player-row" data-player="' + player.name + '">' +
        '<div class="player-name">' + flag(player) + '<span>' + player.name + '</span></div>' +
        '<div class="player-bet-compo">' +
        odds(player.odds[0], 'multiple-' + player.name + '-0') +
        odds(player.odds[1], 'multiple-' + player.name + '-1') +
        '</div>' +
      '</div>';
    }).join('') || '<p class="empty">Aucun joueur ne correspond a ce filtre.</p>';
    updateMoreButton('multiple', visible.length, defaultLimit);
    bindOdds(list);
  }

  function renderPeriodPlayers() {
    var list = root.querySelector('[data-period-players]');
    if (!list) return;
    var visible = visiblePlayers();
    var defaultLimit = selectedPlayer ? 1 : 1;
    var limit = expandedMarkets.period ? visible.length : defaultLimit;
    list.innerHTML = visible.slice(0, limit).map(function (player) {
      return '<div class="player-row" data-player="' + player.name + '">' +
        '<div class="player-name">' + flag(player) + '<span>' + player.name + '</span></div>' +
        '<div class="player-bet-compo">' + odds('2,45', 'period-' + player.name + '-0') + odds('2,35', 'period-' + player.name + '-1') + '</div>' +
      '</div>';
    }).join('') || '<p class="empty">Aucun joueur ne correspond a ce filtre.</p>';
    updateMoreButton('period', visible.length, defaultLimit);
    bindOdds(list);
  }

  function refreshScorerMarkets() {
    renderPrimaryPlayers();
    renderPlayers();
    renderPeriodPlayers();
  }

  function updateBasket() {
    var count = root.querySelector('[data-basket-count]');
    if (count) count.textContent = selectedOdds ? String(selectedOdds) : '';
  }

  function bindOdds(scope) {
    scope.querySelectorAll('[data-goal-trigger]').forEach(function (button) {
      if (button.getAttribute('data-bound') === 'true') return;
      button.setAttribute('data-bound', 'true');
      button.addEventListener('click', function () {
        var nextSelected = !button.classList.contains('is-selected');
        var key = button.getAttribute('data-odd-key');
        button.classList.toggle('is-selected', nextSelected);
        if (key) selectedOddKeys[key] = nextSelected;
        selectedOdds += nextSelected ? 1 : -1;
        updateBasket();
        if (nextSelected && button.hasAttribute('data-goal-trigger')) showGoal();
      });
    });
  }

  function scrollToScorers() {
    var scorers = root.querySelector('#buteurs-multiples');
    if (scorers) scorers.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function activateScorerFilter() {
    root.querySelectorAll('[data-market-group="generic"]').forEach(function (market) { market.hidden = true; });
    root.querySelectorAll('[data-market-group="scorers"]').forEach(function (market) { market.hidden = false; });
    root.querySelectorAll('[data-scroll-buteurs]').forEach(function (button) {
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
    });
    var subfilters = root.querySelector('[data-player-subfilters]');
    if (subfilters) {
      subfilters.hidden = false;
      root.classList.add('has-player-subfilters');
    }
    scrollToScorers();
  }

  function resetScorerFilter() {
    root.querySelectorAll('[data-market-group]').forEach(function (market) { market.hidden = false; });
    root.querySelectorAll('[data-scroll-buteurs]').forEach(function (button) {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Filtrer les marchés Buteurs');
    });
    selectedPlayer = null;
    updatePlayerChipSelection();
    var subfilters = root.querySelector('[data-player-subfilters]');
    if (subfilters) {
      subfilters.hidden = true;
      root.classList.remove('has-player-subfilters');
    }
    refreshScorerMarkets();
  }

  root.querySelectorAll('[data-scroll-buteurs]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (button.classList.contains('is-active')) {
        resetScorerFilter();
      } else {
        button.setAttribute('aria-label', 'Retirer le filtre Buteurs');
        activateScorerFilter();
      }
    });
  });

  root.querySelectorAll('[data-segment]').forEach(function (button) {
    button.addEventListener('click', function () {
      selectedTeam = button.getAttribute('data-segment');
      expandedMarkets.primary = false;
      expandedMarkets.multiple = false;
      expandedMarkets.period = false;
      root.querySelectorAll('[data-segment]').forEach(function (item) {
        var active = item.getAttribute('data-segment') === selectedTeam;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      refreshScorerMarkets();
    });
  });

  root.querySelectorAll('[data-player-chip]').forEach(function (button) {
    button.addEventListener('click', function () {
      var playerSubfilters = root.querySelector('[data-player-subfilters]');
      selectedPlayer = button.getAttribute('data-player-chip');
      expandedMarkets.primary = false;
      expandedMarkets.multiple = false;
      expandedMarkets.period = false;
      root.querySelectorAll('[data-player-chip]').forEach(function (chip) {
        var active = chip === button;
        chip.classList.toggle('is-active', active);
        chip.setAttribute('aria-pressed', String(active));
      });
      if (playerSubfilters) {
        playerSubfilters.scrollTo({ left: Math.max(0, button.offsetLeft - (playerSubfilters.clientWidth - button.offsetWidth) / 2), behavior: 'smooth' });
      }
      refreshScorerMarkets();
      activateScorerFilter();
    });
  });

  root.querySelectorAll('[data-more]').forEach(function (button) {
    button.addEventListener('click', function () {
      var market = button.getAttribute('data-more');
      expandedMarkets[market] = !expandedMarkets[market];
      refreshScorerMarkets();
    });
  });

  var dialog = root.querySelector('[data-player-dialog]');
  var searchButton = root.querySelector('[data-player-search]');
  var input = root.querySelector('[data-player-input]');
  var picker = root.querySelector('[data-player-picker]');

  function updatePlayerChipSelection() {
    root.querySelectorAll('[data-player-chip]').forEach(function (chip) {
      var active = chip.getAttribute('data-player-chip') === selectedPlayer;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function renderPicker(query) {
    if (!picker) return;
    var lowered = (query || '').toLowerCase();
    picker.innerHTML = players.filter(function (player) {
      return player.name.toLowerCase().indexOf(lowered) !== -1;
    }).map(function (player) {
      var isSelected = selectedPlayer === player.name;
      return '<button type="button" class="picker-row' + (isSelected ? ' is-selected' : '') + '" data-pick="' + player.name + '">' +
        flag(player) + '<span>' + player.name + '</span>' + (isSelected ? '<span aria-hidden="true">OK</span>' : '') +
      '</button>';
    }).join('');
    picker.querySelectorAll('[data-pick]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedPlayer = button.getAttribute('data-pick');
        updatePlayerChipSelection();
        renderPicker(input ? input.value : '');
      });
    });
  }

  var goalScreen = root.querySelector('[data-goal-screen]');
  function showGoal() {
    if (!goalScreen) return;
    goalScreen.hidden = false;
    window.scrollTo(0, 0);
    if (window.location.hash !== '#goal') window.history.pushState({ screen: 'goal' }, '', '#goal');
  }

  function hideGoal() {
    if (goalScreen) goalScreen.hidden = true;
  }

  window.addEventListener('popstate', hideGoal);
  if (window.location.hash === '#goal') showGoal();

  if (variant === 'player-filter' && searchButton && dialog) {
    searchButton.addEventListener('click', function () {
      dialog.hidden = false;
      renderPicker('');
      if (input) input.focus();
    });
    input.addEventListener('input', function () { renderPicker(input.value); });
    dialog.querySelector('[data-filter-cancel]').addEventListener('click', function () {
      dialog.hidden = true;
      selectedPlayer = null;
      updatePlayerChipSelection();
      input.value = '';
      refreshScorerMarkets();
    });
    dialog.querySelector('[data-filter-apply]').addEventListener('click', function () {
      dialog.hidden = true;
      refreshScorerMarkets();
      if (selectedPlayer) activateScorerFilter();
    });
  }

  bindOdds(root);
  refreshScorerMarkets();
  updateBasket();
}());
