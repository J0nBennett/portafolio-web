const EXTERNAL_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

function splitPath(input: string) {
  const [pathWithQuery, hash = ""] = input.split("#", 2);
  const [rawPath = "/", query = ""] = pathWithQuery.split("?", 2);
  return { rawPath, query, hash };
}

function normalizePathname(pathname: string) {
  const normalized = `/${pathname.replace(/^\/+/, "").replace(/\/{2,}/g, "/")}`;
  return normalized === "//" ? "/" : normalized;
}

export function isExternalUrl(value: string) {
  return (
    EXTERNAL_URL_PATTERN.test(value) ||
    value.startsWith("//") ||
    value.startsWith("#") ||
    value.startsWith("tel:")
  );
}

export function normalizeBasePath(basePath = "/") {
  const trimmed = basePath.trim();
  if (!trimmed || trimmed === "/") return "/";
  const noEdges = trimmed.replace(/^\/+|\/+$/g, "");
  return noEdges ? `/${noEdges}` : "/";
}

export function withBasePath(path: string, basePath = "/") {
  if (!path || isExternalUrl(path)) return path;

  const base = normalizeBasePath(basePath);
  const { rawPath, query, hash } = splitPath(path);
  const normalizedPath = normalizePathname(rawPath);

  const pathWithBase =
    base === "/" || normalizedPath === base || normalizedPath.startsWith(`${base}/`)
      ? normalizedPath
      : normalizedPath === "/"
        ? `${base}/`
        : `${base}${normalizedPath}`;

  const querySuffix = query ? `?${query}` : "";
  const hashSuffix = hash ? `#${hash}` : "";
  return `${pathWithBase}${querySuffix}${hashSuffix}`;
}

export function toAbsoluteUrl(pathOrUrl: string, siteOrigin: string, basePath = "/") {
  if (isExternalUrl(pathOrUrl)) return pathOrUrl;
  const relativeToOrigin = withBasePath(pathOrUrl, basePath);
  return new URL(relativeToOrigin, siteOrigin).toString();
}
