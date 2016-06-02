import { OpaqueToken, Provider } from '@angular/core';

import { flatten } from './util';
import { CONNECT_EFFECTS_PROVIDER, BOOTSTRAP_EFFECTS } from './effects';
import { STATE_UPDATES_PROVIDER } from './state-updates';


export function runEffects(...effects: any[]) {
  const flattened = flatten(effects);

  const individuals = flattened
    .map(effectType => new Provider(effectType, {
      useFactory: (effectInstances: any[]) =>
        effectInstances.filter(instance => instance instanceof effectType)[0],
      deps: [BOOTSTRAP_EFFECTS]
    }));

  const allEffects = flattened
    .map(effect => new Provider(BOOTSTRAP_EFFECTS, {
      useClass: effect,
      multi: true
    }));

  return [
    ...individuals,
    ...allEffects,
    CONNECT_EFFECTS_PROVIDER,
    STATE_UPDATES_PROVIDER
  ];
}