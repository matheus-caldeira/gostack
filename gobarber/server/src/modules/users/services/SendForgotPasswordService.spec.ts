import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import SendForgotPassword from './SendForgotPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPassword: SendForgotPassword;

describe('SendForgotPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPassword = new SendForgotPassword(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recovery the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      name: 'Teste',
      password: '123456',
    });

    await sendForgotPassword.execute({ email: user.email });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recovery a non-existing user password', async () => {
    await expect(
      sendForgotPassword.execute({ email: 'mail-nox@t.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      email: 'teste@t.com',
      name: 'Teste',
      password: '123456',
    });

    await sendForgotPassword.execute({ email: user.email });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
