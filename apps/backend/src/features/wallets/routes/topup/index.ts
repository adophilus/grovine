import { Hono } from 'hono';
import middleware from './middleware';
import service from './service';
import { StatusCodes } from '@/features/http';

export default new Hono().patch('/:id', middleware, async (c) => {
  const id = c.req.param('id');
  const { amount } = await c.req.json();

  if (!amount || amount <= 0) {
    return c.json({ code: 'ERR_INVALID_AMOUNT', message: 'Amount must be greater than 0' }, StatusCodes.BAD_REQUEST);
  }

  const result = await service(id, amount); 

  if (result.isErr) {
    return c.json(result.error, StatusCodes.BAD_REQUEST);
  }

  return c.json(result.value, StatusCodes.OK);
});