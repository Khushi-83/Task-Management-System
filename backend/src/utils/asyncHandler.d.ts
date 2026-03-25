import { Request, Response, NextFunction } from 'express';
export declare const asyncHandler: (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=asyncHandler.d.ts.map