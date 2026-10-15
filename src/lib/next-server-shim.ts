export class NextResponse {
  body: any;
  status: number;
  headers: Headers;

  constructor(body?: any, init?: ResponseInit) {
    this.body = body;
    this.status = init?.status || 200;
    this.headers = new Headers(init?.headers);
  }

  static json(data: any, init?: ResponseInit) {
    return new Response(JSON.stringify(data), {
      ...init,
      status: init?.status || 200,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }
}

export type NextRequest = Request & {
  json: () => Promise<any>;
  nextUrl?: URL;
  cookies?: any;
};

export default {
  NextResponse,
};
