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
    { name: 'Adrien Rabiot', team: 'France', flag: 'fr', odds: ['10,50', '65'], primary: ['2,90', '6,00', '6,00'], period: ['4,55', '4,30'] }
  ];
  players[0].period = ['2,45', '2,35'];
  players[1].period = ['3,50', '3,35'];
  players[2].period = ['3,70', '3,50'];
  players[3].period = ['3,70', '3,50'];
  players[4].period = ['4,55', '4,30'];
  players[5].period = ['4,55', '4,30'];
  players[6].period = ['4,55', '4,30'];
  players[7].period = ['4,55', '4,30'];
  players[8].period = ['4,55', '4,30'];
  var doublePlayers = [
    { label: 'K.Mbappe/M. Olise', names: ['Kylian Mbappe', 'Michael Olise'], flag: 'fr', odds: ['3,35', '10,30'] },
    { label: 'K.Mbappe/O.Dembele', names: ['Kylian Mbappe', 'Ousmane Dembele'], flag: 'fr', odds: ['6,50', '30'] },
    { label: 'K.Mbappe/D.Doue', names: ['Kylian Mbappe', 'Desire Doue'], flag: 'fr', odds: ['7,00', '35'] },
    { label: 'K.Mbappe/R.Cherki', names: ['Kylian Mbappe'], flag: 'fr', odds: ['7,00', '35'] },
    { label: 'J.David/P.David', names: ['Jonathan David', 'Promise David'], flag: 'ca', odds: ['10,50', '65'] },
    { label: 'J.David/T.Oluwaseyi', names: ['Jonathan David', 'Tani Oluwaseyi'], flag: 'ca', odds: ['10,50', '65'] },
    { label: 'Tani Oluwaseyi', names: ['Tani Oluwaseyi'], flag: 'ca', odds: ['10,50', '65'] },
    { label: 'Adrien Rabiot', names: ['Adrien Rabiot'], flag: 'fr', odds: ['10,50', '65'] }
  ];
  var selectedTeam = 'Tous';
  var selectedPlayer = null;
  var selectedOdds = 0;
  var expandedMarkets = {};
  var selectedOddKeys = {};
  var marketSearchQuery = '';

  function normalizeSearchText(value) {
    var text = String(value || '').trim().toLowerCase();
    return text.normalize ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : text;
  }

  function isMarketSearchActive() {
    return normalizeSearchText(marketSearchQuery).length >= 2;
  }

  function flag(player) {
    return player.flag === 'ca'
      ? '<span class="flag flag-ca" aria-label="Canada"><img src="figma-assets/market-flag-ca.png" alt=""></span>'
      : '<span class="flag flag-fr" aria-label="France"><img class="flag-image" src="figma-assets/market-flag-fr.png" alt=""></span>';
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
    var limit = isMarketSearchActive() || expandedMarkets.primary ? visible.length : defaultLimit;
    list.innerHTML = visible.slice(0, limit).map(function (player, index) {
      var overflow = isMarketSearchActive() && !expandedMarkets.primary && index >= defaultLimit ? ' data-search-overflow="true"' : '';
      return '<div class="primary-player-row" data-player="' + player.name + '"' + overflow + '>' +
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
    var limit = isMarketSearchActive() || expandedMarkets.multiple ? visible.length : defaultLimit;
    list.innerHTML = visible.slice(0, limit).map(function (player, index) {
      var overflow = isMarketSearchActive() && !expandedMarkets.multiple && index >= defaultLimit ? ' data-search-overflow="true"' : '';
      return '<div class="player-row" data-player="' + player.name + '"' + overflow + '>' +
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
    var defaultLimit = selectedPlayer ? 1 : 5;
    var limit = isMarketSearchActive() || expandedMarkets.period ? visible.length : defaultLimit;
    list.innerHTML = visible.slice(0, limit).map(function (player, index) {
      var overflow = isMarketSearchActive() && !expandedMarkets.period && index >= defaultLimit ? ' data-search-overflow="true"' : '';
      return '<div class="player-row" data-player="' + player.name + '"' + overflow + '>' +
        '<div class="player-name">' + flag(player) + '<span>' + player.name + '</span></div>' +
        '<div class="player-bet-compo">' + odds((player.period || ['2,45', '2,35'])[0], 'period-' + player.name + '-0') + odds((player.period || ['2,45', '2,35'])[1], 'period-' + player.name + '-1') + '</div>' +
      '</div>';
    }).join('') || '<p class="empty">Aucun joueur ne correspond a ce filtre.</p>';
    updateMoreButton('period', visible.length, defaultLimit);
    bindOdds(list);
  }

  function renderDoublePlayers() {
    var list = root.querySelector('[data-double-players]');
    if (!list) return;
    var visible = doublePlayers.filter(function (entry) {
      return !selectedPlayer || entry.names.indexOf(selectedPlayer) !== -1;
    });
    var defaultLimit = selectedPlayer ? visible.length : 5;
    var limit = isMarketSearchActive() || expandedMarkets.double ? visible.length : defaultLimit;
    list.innerHTML = visible.slice(0, limit).map(function (entry, index) {
      var overflow = isMarketSearchActive() && !expandedMarkets.double && index >= defaultLimit ? ' data-search-overflow="true"' : '';
      return '<div class="player-row" data-player="' + entry.label + '"' + overflow + '>' +
        '<div class="player-name">' + flag({ flag: entry.flag }) + '<span>' + entry.label + '</span></div>' +
        '<div class="player-bet-compo">' + odds(entry.odds[0], 'double-' + entry.label + '-0') + odds(entry.odds[1], 'double-' + entry.label + '-1') + '</div>' +
      '</div>';
    }).join('') || '<p class="empty">Aucun joueur ne correspond à ce filtre.</p>';
    updateMoreButton('double', visible.length, defaultLimit);
    bindOdds(list);
  }

  function refreshScorerMarkets() {
    renderPrimaryPlayers();
    renderPlayers();
    renderDoublePlayers();
    renderPeriodPlayers();
    applyMarketSearch(marketSearchQuery);
    updateMarketBottomPadding();
  }

  function updateMarketBottomPadding() {
    root.querySelectorAll('.market').forEach(function (market) {
      var controls = Array.prototype.slice.call(market.querySelectorAll('.show-more'));
      var hasVisibleMore = controls.some(function (control) {
        return !control.hidden && !control.classList.contains('search-hidden-control');
      });
      market.classList.toggle('market--no-more', controls.length === 0 || !hasVisibleMore);
    });
  }

  function applyMarketSearch(query) {
    var normalizedQuery = normalizeSearchText(query);
    var active = normalizedQuery.length >= 2;

    root.querySelectorAll('.market').forEach(function (market) {
      var title = market.querySelector('.market-title h2');
      var titleMatches = Boolean(active && title && normalizeSearchText(title.textContent).indexOf(normalizedQuery) !== -1);
      var playerRows = Array.prototype.slice.call(market.querySelectorAll('[data-player]'));
      var oddsButtons = playerRows.length ? [] : Array.prototype.slice.call(market.querySelectorAll('.odds'));
      var rows = playerRows.length ? playerRows : oddsButtons;
      var rowMatches = rows.map(function (row) {
        var label = row.querySelector(playerRows.length ? '.player-name' : '.odds small');
        return normalizeSearchText(label ? label.textContent : row.textContent).indexOf(normalizedQuery) !== -1;
      });
      var hasRowMatch = rowMatches.some(function (matches) { return matches; });
      var showWholeMarket = active && !hasRowMatch && titleMatches;

      market.classList.toggle('search-hidden', active && !hasRowMatch && !titleMatches);
      rows.forEach(function (row, index) {
        row.classList.toggle('search-hidden-row', active && hasRowMatch && !rowMatches[index]);
        row.classList.toggle('search-hidden-overflow', showWholeMarket && row.getAttribute('data-search-overflow') === 'true');
      });

      if (!playerRows.length) {
        market.querySelectorAll('.odds-grid').forEach(function (grid) {
          var gridButtons = Array.prototype.slice.call(grid.querySelectorAll('.odds'));
          var gridHasMatch = showWholeMarket || gridButtons.some(function (button) {
            return !button.classList.contains('search-hidden-row');
          });
          grid.classList.toggle('search-hidden-row', active && hasRowMatch && !gridHasMatch);
        });
      }

      market.querySelectorAll('.show-more').forEach(function (control) {
        control.classList.toggle('search-hidden-control', active && hasRowMatch);
      });
    });
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
      expandedMarkets.double = false;
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
      expandedMarkets.double = false;
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
  var searchOpen = root.querySelector('[data-player-search-open]');
  var inlineInput = root.querySelector('[data-player-inline-input]');
  var searchClear = root.querySelector('[data-player-search-clear]');
  var input = root.querySelector('[data-player-input]');
  var picker = root.querySelector('[data-player-picker]');

  function updatePlayerChipSelection() {
    root.querySelectorAll('[data-player-chip]').forEach(function (chip) {
      var active = chip.getAttribute('data-player-chip') === selectedPlayer;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function filterPlayerChips(query) {
    var lowered = normalizeSearchText(query);
    var active = lowered.length >= 2;
    root.querySelectorAll('[data-player-chip]').forEach(function (chip) {
      var playerName = normalizeSearchText(chip.getAttribute('data-player-chip'));
      chip.hidden = active && playerName.indexOf(lowered) === -1;
    });
  }

  function expandInlineSearch() {
    if (!searchButton || !inlineInput) return;
    searchButton.classList.add('is-expanded');
    searchButton.setAttribute('aria-expanded', 'true');
    if (searchOpen) searchOpen.hidden = true;
    inlineInput.hidden = false;
    if (searchClear) searchClear.hidden = false;
    inlineInput.focus();
  }

  function resetInlineSearch() {
    if (!inlineInput) return;
    inlineInput.value = '';
    marketSearchQuery = '';
    filterPlayerChips('');
    refreshScorerMarkets();
    inlineInput.focus();
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

  if (searchButton && searchOpen && inlineInput) {
    searchOpen.addEventListener('click', expandInlineSearch);
    inlineInput.addEventListener('input', function () {
      marketSearchQuery = inlineInput.value.trim();
      filterPlayerChips(inlineInput.value);
      refreshScorerMarkets();
    });
    if (searchClear) searchClear.addEventListener('click', resetInlineSearch);
  }

  if (variant === 'player-filter' && searchButton && dialog) {
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
