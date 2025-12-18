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
