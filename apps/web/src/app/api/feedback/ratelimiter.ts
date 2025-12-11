import rateLimit from 'express-rate-limit';
import { NextResponse } from 'next/server';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

export async function applyRateLimit(request: Request): Promise<NextResponse | null> {
  return new Promise((resolve) => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    const req: any = {
      ip: ip,
      headers: {
        get: (name: string) => request.headers.get(name)
      },
      socket: {
        remoteAddress: ip
      }
    };

    const res: any = {
      statusCode: 200,
      setHeader: () => res,
      getHeader: () => undefined,
      removeHeader: () => res,
      status: (code: number) => {
        res.statusCode = code;
        return res;
      },
      json: (data: any) => {
        res.jsonData = data;
        return res;
      },
      send: (data: any) => {
        res.sendData = data;
        return res;
      },
      end: () => {
        if (res.statusCode === 429) {
          resolve(NextResponse.json(
            { error: res.jsonData?.message || res.sendData || 'Too many requests, please try again later.' },
            { status: 429 }
          ));
        } else {
          resolve(null);
        }
      }
    };

    const next = () => {
      resolve(null);
    };

    limiter(req, res, next);
  });
}