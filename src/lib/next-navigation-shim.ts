export function notFound(): never {
  const error = new Error('NEXT_NOT_FOUND');
  (error as any).digest = 'NEXT_NOT_FOUND';
  throw error;
}

export function redirect(url: string): never {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
  const error = new Error(`NEXT_REDIRECT: ${url}`);
  (error as any).digest = `NEXT_REDIRECT;replace;${url}`;
  throw error;
}

export function useRouter() {
  return {
    push: (url: string) => {
      if (typeof window !== 'undefined') window.location.href = url;
    },
    replace: (url: string) => {
      if (typeof window !== 'undefined') window.location.replace(url);
    },
    back: () => {
      if (typeof window !== 'undefined') window.history.back();
    },
    forward: () => {
      if (typeof window !== 'undefined') window.history.forward();
    },
    refresh: () => {
      if (typeof window !== 'undefined') window.location.reload();
    },
    prefetch: () => {},
  };
}

export function usePathname(): string {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
}

export function useSearchParams(): URLSearchParams {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
}

export default {
  notFound,
  redirect,
  useRouter,
  usePathname,
  useSearchParams,
};
