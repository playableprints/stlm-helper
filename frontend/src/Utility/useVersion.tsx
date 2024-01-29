import pkgjson from "../../package.json";

export function useVersion() {
  return pkgjson.version;
}

export function getVersion() {
  return pkgjson.version;
}
