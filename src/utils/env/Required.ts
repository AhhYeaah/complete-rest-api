export function requiredEnv(param) {
  if (!param) throw Error('Variaveis de ambiente não setadas.');
  return param;
}
