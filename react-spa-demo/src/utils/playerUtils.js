export const getPlayerByExternalID = externalID => {
  return window.voltax?.getPlayerByExternalID?.(externalID) || null; 
};

export const destroyPlayerByExternalID = externalID => {
  const player = getPlayerByExternalID(externalID);
  player?.destroyPlayer?.();
};



export const getPlayerInstanceByExternalID = (externalID, onReady) => {
  const existing = getPlayerByExternalID(externalID);

  if (existing) {
    onReady(existing);
    return;
  }

  const handler = ({ detail }) => {
    const instance = getPlayerByExternalID(externalID);
    if (detail.externalID !== externalID && !instance) {
      return;
    }

    if (instance) {
      window.removeEventListener('voltaxPlayerLoaded', handler);
      onReady(instance);
    }
  };

  window.addEventListener('voltaxPlayerLoaded', handler);
};

export const replacePlayerContentByExternalID = (externalID, options) => {
  const player = getPlayerByExternalID(externalID);
  if (!player) {
    return;
  }

  const maybePromise = player.replacePlayerContent?.(options);
  const reinject = () => {
    const target = document.querySelector(`#${containerId}`);
    if (target) {
      player.injectPlayer?.(target);
    }
  };

  if (maybePromise?.then) {
    maybePromise.then(reinject).catch(error => {
      console.warn('replacePlayerContent error', error);
    });
  } else {
    reinject();
  }
};


export const S2N_OLD_LEGACY_EMBED_SRC = 'https://embed.sendtonews.com/player3/embedcode.js';
export const S2N_MODERN_EMBED_SRC = 'https://players.voltaxservices.io/players/<orgID>/<propertyID>/embed';

export const getEmbedSrc = (orgID, propertyID, isLegacy = false) => {
  return isLegacy ? S2N_OLD_LEGACY_EMBED_SRC : S2N_MODERN_EMBED_SRC.replace('<orgID>', orgID).replace('<propertyID>', propertyID);
};
