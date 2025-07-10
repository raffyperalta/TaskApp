import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
    });
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        issues: result.error.errors,
      });
      return;
    }
    next();
  };
}

// export const validateCreateTask = (schema: AnyZodObject) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const result = schema.safeParse(req.body);
//     if (!result.success) {
//       res.status(400).json({
//         error: 'Validation failed',
//         issues: result.error.errors,
//       });
//       return;
//     }
//     next();
//   };
// }