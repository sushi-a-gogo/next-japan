// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import config from '../env_config.json';

const { apiUri } = config as {
  apiUri: string;
};

export const environment = {
  production: false,
  envName: 'dev',
  apiUri: config.apiUri,
};
