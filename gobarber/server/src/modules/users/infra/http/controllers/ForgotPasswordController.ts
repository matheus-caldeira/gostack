import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordService from '@modules/users/services/SendForgotPasswordService';

class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordService = container.resolve(
      SendForgotPasswordService,
    );

    await sendForgotPasswordService.execute({
      email,
    });

    return response.status(204).json();
  }
}

export default ForgotPasswordController;
