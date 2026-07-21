const SITE_HOST = 'online-tutoring-seo-site.vercel.app';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = 'ceVlgsQpVQ76y3w2F29iOhqPCKu02osl';
const MAX_URLS = 10000;

type IndexNowRequestBody = {
  urls?: unknown;
};

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, { status });
}

function validateUrlList(body: IndexNowRequestBody) {
  if (!Array.isArray(body.urls) || body.urls.length === 0) {
    return {
      error: jsonResponse({ ok: false, message: 'urls must be a non-empty array' }, 400),
    };
  }

  if (body.urls.length > MAX_URLS) {
    return {
      error: jsonResponse({ ok: false, message: `urls cannot contain more than ${MAX_URLS} items` }, 400),
    };
  }

  const urlList: string[] = [];

  for (const urlValue of body.urls) {
    if (typeof urlValue !== 'string') {
      return {
        error: jsonResponse({ ok: false, message: 'Every URL must be a string' }, 400),
      };
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(urlValue);
    } catch {
      return {
        error: jsonResponse({ ok: false, message: 'Every URL must be a valid absolute URL' }, 400),
      };
    }

    if (parsedUrl.origin !== SITE_ORIGIN) {
      return {
        error: jsonResponse({ ok: false, message: `Every URL must belong to ${SITE_ORIGIN}` }, 400),
      };
    }

    urlList.push(parsedUrl.href);
  }

  return { urlList };
}

export async function GET() {
  return Response.json({
    ok: true,
    message: 'IndexNow API is ready',
  });
}

export async function POST(request: Request) {
  let body: IndexNowRequestBody;

  try {
    body = (await request.json()) as IndexNowRequestBody;
  } catch {
    return jsonResponse({ ok: false, message: 'Request body must be valid JSON' }, 400);
  }

  const validation = validateUrlList(body);

  if ('error' in validation) {
    return validation.error;
  }

  const indexNowResponse = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
      urlList: validation.urlList,
    }),
  });

  return jsonResponse(
    {
      ok: indexNowResponse.ok,
      message: indexNowResponse.ok ? 'URLs submitted to IndexNow' : 'IndexNow submission failed',
      status: indexNowResponse.status,
    },
    indexNowResponse.ok ? 200 : indexNowResponse.status,
  );
}
