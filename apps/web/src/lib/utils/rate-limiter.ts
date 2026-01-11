import rateLimit from 'express-rate-limit';
import { NextResponse } from 'next/server';

interface RateLimitConfig {
    windowMs: number;
    max: number;
}

const limiters = new Map<string, any>();

function getLimiter(config: RateLimitConfig) {
    const key = `${config.windowMs}-${config.max}`;
    
    if (!limiters.has(key)) {
        limiters.set(key, rateLimit({
            windowMs: config.windowMs,
            max: config.max,
            message: 'Too many requests, please try again later.',
            standardHeaders: true,
            legacyHeaders: false,
            skipSuccessfulRequests: false,
        }));
    }
    
    return limiters.get(key);
}

export async function applyRateLimit(request: Request, config: RateLimitConfig = {
    windowMs: 1 * 60 * 1000,
    max: 5
}): Promise<NextResponse | null> {
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

        const limiter = getLimiter(config);
        limiter(req, res, next);
    });
}
